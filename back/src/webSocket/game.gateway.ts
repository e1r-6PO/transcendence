
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
        private gameService: GameService
      ) {}
    queue: Socket[] = []
    id_to_user = new Map<number, User>();
    
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
        game.player0 = game.player0socket['info'] // putting the infos inside a User class to get access User class function
        game.player1 = game.player1socket['info'] //
        game.player0socket.join(game.id.toString())
        game.player1socket.join(game.id.toString())
        game.player0socket['game'] = game.id // useful for when the client temporarily disconnect midgame (pause the game)
        game.player1socket['game'] = game.id //
        game.room = this.server.to(game.id.toString())
        this.gameService.push_game(game) //also starting the game via game.start()
    }

    @SubscribeMessage('joinQueue') // to join the queue if he is in the queue, kick him
    async joinQueue(client: Socket) {
        this.queue.push(client)
        if (this.queue.length >= 2) {
            this.create_game() // await may be needed later on
        }
    }

    @SubscribeMessage('forfeit')
    async forfeit(client: Socket, info: []) {

        var game: Game = this.gameService.games.get(info['id'])

        console.log(client['info'].id, game.player0.id, game.player1.id)

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
        this.id_to_user.set(user_data.id, user_data)
        client['info'] = user_data
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
