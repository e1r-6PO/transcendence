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
import { AdvancedConsoleLogger } from "typeorm";

@WebSocketGateway()

export class AppGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect{
    @WebSocketServer() server: Server;
    private logger: Logger = new Logger('AppGateway');

    @SubscribeMessage('msgToServer')
    handleMessage(client: Socket, payload: string): void{
        this.server.emit('msgToClient', payload);
    }

    afterInit(server: Server){
        this.logger.log('Init');
    }

    handleDisconnect(client: Socket){
        this.logger.log(`Client disconnected: ${client.id}`)
    }

    handleConnection(client: Socket, ...args: any[]){
        this.logger.log(`Client connected: ${client.id}`);
    }
}
