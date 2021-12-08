
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
    
    @WebSocketServer() server: Server;
    private logger: Logger = new Logger('AppGateway');

    @SubscribeMessage('msgToServer')
    async handleMessage(client: Socket, payload: string): Promise<void>{

        this.server.emit('msgToClient', 'lol');
    }

    afterInit(server: Server){
        this.logger.log('Init');
    }

    async handleConnection(client: Socket, ...args: any[]){
        console.log('Connected in game namespace')
    }

    async handleDisconnect(){
        console.log('Disconnected from game namespace')
    }
}
