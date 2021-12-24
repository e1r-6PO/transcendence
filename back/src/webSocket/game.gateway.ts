
import {
    WebSocketGateway,
    SubscribeMessage,
    OnGatewayInit,
    WebSocketServer,
    OnGatewayConnection,
    OnGatewayDisconnect,
} from "@nestjs/websockets";
import { Socket, Server } from 'socket.io';
import { Logger } from "@nestjs/common";
import { AdvancedConsoleLogger, Repository } from "typeorm";
import { JwtService } from '@nestjs/jwt';
import cookieParser from "cookie-parser";
import { AddUserIdMiddleware } from "src/middleware/account.middleware";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/entity/user.entity";
import { Messages } from "src/entity/messages.entity"
import { Game } from "src/entity/game.entity";
import { GameService } from "src/service/game.service";

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
      ) {}
    gameService: GameService = new GameService
    queue: Socket[] = []
    id_to_user = new Map<number, User>();
    
    @WebSocketServer() server: Server;
    private logger: Logger = new Logger('AppGateway');

    @SubscribeMessage('joinQueue')
    async joinQueue(client: Socket) {
        this.queue.push(client)
        if (this.queue.length >= 2) {
            var game: Game = new Game
            game.players = [this.queue[0], this.queue[1]]
            this.queue.splice(0, 2)
            this.gameService.push_game(game) //also starting the game
        }
    }

    @SubscribeMessage('leave')
    async leave(client: Socket) {
        client.disconnect()
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
