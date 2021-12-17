
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

    gameService: GameService = new GameService
    queue: Socket[] = []
    
    @WebSocketServer() server: Server;
    private logger: Logger = new Logger('AppGateway');

    afterInit(server: Server){
        this.logger.log('Init');
    }

    async handleConnection(client: Socket, ...args: any[]){
        this.queue.push(client)
        if (this.queue.length >= 2) {
            var game: Game = new Game
            game.players = [this.queue[0], this.queue[1]]
            this.queue.splice(0, 2)
            this.gameService.push_game(game) //also starting the game
        }
    }

    async handleDisconnect(client: Socket){
        var index: number

        index = this.queue.findIndex(clients => clients.id === client.id)
        if (index != -1) {
            this.queue.splice(index, 1)
        }
        else
            this.gameService.disconnect(client)
        // console.log("disconnected: " + client.id)
    }
}
