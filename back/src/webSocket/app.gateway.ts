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
    middlewares: [ AddUserIdMiddleware ]
})

export class AppGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect{
    constructor(
        private jwtService : JwtService,
        @InjectRepository(User)
        private readonly usersRepository : Repository<User>,
        @InjectRepository(Messages)
        private readonly messagesRepository : Repository<Messages>
      ) {}

    count: number = 0;
    clients = {};

    @WebSocketServer() server: Server;
    private logger: Logger = new Logger('AppGateway');

    @SubscribeMessage('msgToServer')
    async handleMessage(client: Socket, payload: string): Promise<void>{
        var newMsg: Messages = new Messages;
        
        const jwt = client.handshake.headers.cookie
        .split('; ')
        .find((cookie: string) => cookie.startsWith('jwt'))
        if (jwt == null)
        {
            client.disconnect()
            return
        }
        this.count++;
        console.log('New connection, users count: ' + this.count );
        // parse cookies
        const jwt_decoded = this.jwtService.decode(jwt.split('=')[1])

        let user_data = await this.usersRepository.findOne({
            where: {id: jwt_decoded['id']}
        })
        
        newMsg.message = payload;
        newMsg.time = new Date();
        newMsg.senderId = user_data.id;
        newMsg.senderNick = user_data.nickName;
        
        this.messagesRepository.save(newMsg)
        this.server.emit('msgToClient', newMsg);
    }

    afterInit(server: Server){
        this.logger.log('Init');
    }

    async handleDisconnect(client: Socket){
        this.count--;
        this.logger.log(`Client disconnected: ${client.id}`)
        console.log('User disconnected, users count: ' + this.count );
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
        this.count++;
        console.log('New connection, users count: ' + this.count );
        // parse cookies
        const jwt_decoded = this.jwtService.decode(jwt.split('=')[1])

        let user_data = await this.usersRepository.findOne({
            where: {id: jwt_decoded['id']}
        })
        
        console.log(user_data)
    }
}
