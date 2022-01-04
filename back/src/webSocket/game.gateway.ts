
import {
    WebSocketGateway,
    SubscribeMessage,
    OnGatewayInit,
    WebSocketServer,
    OnGatewayConnection,
    OnGatewayDisconnect,
} from "@nestjs/websockets";
import { Socket, Server, BroadcastOperator } from 'socket.io';
import { forwardRef, Inject, Logger } from "@nestjs/common";
import { AdvancedConsoleLogger, Repository } from "typeorm";
import { JwtService } from '@nestjs/jwt';
import cookieParser from "cookie-parser";
import { AddUserIdMiddleware } from "src/middleware/account.middleware";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/entity/user.entity";
import { Messages } from "src/entity/messages.entity"
import { Game } from "src/entity/game.entity";
import { GameService } from "src/service/game.service";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import {v4 as uuidv4} from 'uuid';
import { PrivateMessage } from "src/entity/privateMessage.entity";

@WebSocketGateway({
    cors: {
        origin: "http://localhost:8000",
        credentials: true
    },
    middlewares: [ AddUserIdMiddleware ],
    namespace: '/game'
})

export class GameGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect{
    constructor(
        private jwtService : JwtService,
        @InjectRepository(User)
        private readonly usersRepository : Repository<User>,
        @InjectRepository(PrivateMessage)
        private readonly privateMessageRepository: Repository<PrivateMessage>,
        private gameService: GameService
      ) {}
    queue: Socket[] = []
    id_to_user = new Map<number, Socket>();
    
    @WebSocketServer() server: Server;
    private logger: Logger = new Logger('AppGateway');

    @SubscribeMessage('join') // to spectate a game or to see a game history
    async join(client: Socket, info: []) {
        this.gameService.join(client, info['id'])
    }

    async create_game() {
        var game: Game = new Game(this.gameService, 1, 1)
        game.player0socket = this.queue[0]
        game.player1socket = this.queue[1]
        this.queue.splice(0, 2)
        game.id = uuidv4()
        game.type = "ranked"
        game.player0 = game.player0socket['info'] // putting the infos inside a User class to get access User class function
        game.player1 = game.player1socket['info'] //
        game.player0socket.join(game.id.toString())
        game.player1socket.join(game.id.toString())
        game.player0socket['game'] = game.id // useful for when the client temporarily disconnect midgame (pause the game)
        game.player1socket['game'] = game.id //
        game.room = this.server.to(game.id.toString())
        // this.server.of('/chat').to('room').emit('wsh la miff')
        this.gameService.push_game(game) //also starting the game via game.start()
    }

    create_private_game(initiater: Socket, receiver: Socket) {
        var game: Game = new Game(this.gameService, 1, 1)
        game.player0socket = initiater
        // game.player1socket = receiver
        game.id = uuidv4()
        game.type = "private"
        game.player0 = initiater['info'] // putting the infos inside a User class to get access User class function
        game.player1 = receiver['info'] //
        game.player0socket.join(game.id.toString())
        // game.player1socket.join(game.id.toString())
        game.player0socket['game'] = game.id // useful for when the client temporarily disconnect midgame (pause the game)
        // game.player1socket['game'] = game.id //
        game.room = this.server.to(game.id.toString())
        this.gameService.push_game(game) //also starting the game via game.start()

        return game
    }

    @SubscribeMessage('newPrivate')
    async newPrivateGame(client: Socket, arg: any) {
        var remote = this.id_to_user.get(arg['id'])

        if (remote != undefined && remote.id != client.id) {
            var game: Game = this.create_private_game(client, remote)
            client.emit('notificationPrivateGameInviteSent', game.id)
            remote.emit('notificationPrivateGameInvite', game.id)
            this.gameService.push_game(game)

            var newMsg: PrivateMessage = new PrivateMessage

            newMsg.sender = client['info']
            newMsg.target = remote['info']
            newMsg.message = ""
            newMsg.picture = 'http://localhost:8000/api/users/' + newMsg.sender.id + '/picture'
            newMsg.date = new Date()
            newMsg.type = "game"
            newMsg.game_id = game.id
            newMsg.game_state = "pending"
            this.privateMessageRepository.save(newMsg)
            remote.nsp.server._nsps.get('/chat').emit('privateMessage', newMsg)
        }
        else {
            // player not found or not connected
        }
    }

    @SubscribeMessage('acceptGame')
    async acceptGame(client: Socket, arg: any) {
        var game: Game = this.gameService.games.get(arg['id'])

        if (!game)
            return

        if (client['info'].id == game.player1.id) {
            client.emit('privateGameStarting', arg['id'])
            game.player0socket.emit('privateGameStarting', arg['id'])
            game.start()
        }
    }

    @SubscribeMessage('denyGame')
    async denyGame(client: Socket, arg: any) {
        var game: Game = this.gameService.games.get(arg['id'])

        if (!game)
            return

        if (client['info'].id == game.player1.id || client['info'].id == game.player0.id) {
            game.stop()
            this.gameService.games.delete(game.id)
        }
    }

    @SubscribeMessage('joinQueue') // to join the queue if he is in the queue, kick him
    async joinQueue(client: Socket) {
        console.log(this.gameService.games.size)
        if (this.queue.findIndex(clients => clients.id === client.id) != -1)
            return // dont add him to the queu if he his already inside
        this.queue.push(client)
        if (this.queue.length >= 2) {
            this.create_game() // await may be needed later on
        }
    }

    @SubscribeMessage('leaveQueue')
    async leaveQueue(client: Socket) {
        var index = this.queue.findIndex(clients => clients.id === client.id)
        if (index != -1) {
            this.queue.splice(index, 1)
        }
    }

    @SubscribeMessage('forfeit')
    async forfeit(client: Socket, info: []) {

        var game: Game = this.gameService.games.get(info['id'])

        if (!game)
            return

        if (client['info'].id == game.player0.id) {
            game.player0socket = null
            this.gameService.endgame(game)
        }
        else if (client['info'].id == game.player1.id) {
            game.player1socket = null
            this.gameService.endgame(game)
        }

        // client.disconnect()
    }

    afterInit(server: Server){
        this.server = server
        this.logger.log('Init');
    }

    async handleConnection(client: Socket, ...args: any[]){
        const jwt = client.handshake.headers.cookie
        .split('; ')
        .find((cookie: string) => cookie.startsWith('jwt'))
        if (jwt == null)
        {
            client.disconnect()
            return
        }
        // parse cookies
        const jwt_decoded = this.jwtService.decode(jwt.split('=')[1])

        let user_data: User = await this.usersRepository.findOne({
            where: {id: jwt_decoded['id']}
        })
        if (user_data == null || this.id_to_user.has(user_data.id)) // dont allow him to connect in 2 different places + check if exist
        {
            client.disconnect()
            return
        }
        client['info'] = user_data
        this.id_to_user.set(user_data.id, client)
    }

    async handleDisconnect(client: Socket){
        var index: number

        this.id_to_user.delete(client['info'].id)
        index = this.queue.findIndex(clients => clients.id === client.id)
        if (index != -1) {
            this.queue.splice(index, 1)
        }
        else
            this.gameService.disconnect(client)
        // console.log("disconnected: " + client.id)
    }
}
