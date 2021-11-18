// import {
//     WebSocketGateway,
//     SubscribeMessage,
//     OnGatewayInit,
//     WebSocketServer,
//     OnGatewayConnection,
//     OnGatewayDisconnect,
//     MessageBody,
// } from "@nestjs/websockets";
// import { Socket, Server } from 'socket.io';
// import { Inject, Logger } from "@nestjs/common";
// import { AdvancedConsoleLogger } from "typeorm";
// import { MessageService } from "src/service/message.service";
// import { Message } from '../entity/message.entity';

// @WebSocketGateway()

// export class MessageGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect{

//     @Inject()
//     private messagerieService: MessageService;

//     @WebSocketServer()
//     server: Server;
//     private logger: Logger = new Logger('AppGateway');
//     private connection_count: number = 0;

//     @SubscribeMessage('msgToServer')
//     public async handleMessage(@MessageBody() data: { sender: string, message: string}): Promise<void>{
//         const message: Message = await this.messagerieService.createMessage(data.sender, data.message);
//         this.server.emit('msgToClient', { message });
//     }
 
//     afterInit(server: Server){ this.logger.log('Init');
//     }

//     handleDisconnect(client: Socket){
//         this.connection_count -= 1;
//         this.logger.log(`Client disconnected: ${client.id}`)
//     }

//     public async handleConnection(client: Socket, ...args: any[]){
//         this.connection_count += 1;
//         this.logger.log(`Client connected: ${client.id}`);
//         const message: Message[] = await this.messagerieService.getAll();
//     }
// }
