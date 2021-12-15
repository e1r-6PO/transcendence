
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

@WebSocketGateway({
    cors: {
        origin: "http://localhost:8000",
        credentials: true
    },
    middlewares: [ AddUserIdMiddleware ],
    namespace: '/game'
})

export class GameGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect{

    queue: Socket[] = []
    confirmation: Socket[] = []
    
    @WebSocketServer() server: Server;
    private logger: Logger = new Logger('AppGateway');

    afterInit(server: Server){
        this.logger.log('Init');
    }

    async handleConnection(client: Socket, ...args: any[]){
        this.queue.push(client)
        if (this.queue.length >= 2) {
            await new Promise(r => setTimeout(r, 100));
            var player1: Socket = this.queue[0]
            var player2: Socket = this.queue[1]
            this.confirmation.push(player1)
            this.confirmation.push(player2)
            this.queue.splice(0, 2)
            player2.emit('matchFound')
            player1.emit('matchFound')
        }
    }

    async handleDisconnect(client: Socket){
        var index: number

        index = this.queue.findIndex(clients => clients.id === client.id)
        if (index != -1) {
            this.queue.splice(index, 1)
        }
        index = this.confirmation.findIndex(clients => clients.id === client.id)
        if (index != -1) {
            this.confirmation.splice(index, 1)
        }
        // console.log("disconnected: " + client.id)
    }
}
