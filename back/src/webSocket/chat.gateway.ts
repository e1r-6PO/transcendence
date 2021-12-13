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
    namespace: '/chat'
})
export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect{
    constructor(
        private jwtService : JwtService,
        @InjectRepository(User)
        private readonly usersRepository : Repository<User>,
        @InjectRepository(Messages)
        private readonly messagesRepository : Repository<Messages>
      ) {}

    count: number = 0;

    @WebSocketServer() server: Server;
    private logger: Logger = new Logger('ChatGateway');

    @SubscribeMessage('msgToServer')
    async handleMessage(client: Socket, message: string): Promise<void>{
        var newMsg: Messages = new Messages;
        
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

        newMsg.sender = await this.usersRepository.findOne({
            where: {id: jwt_decoded['id']}
        })
        
        newMsg.message = message;
        newMsg.time = new Date();
        newMsg.senderNick = newMsg.sender.nickName;
        newMsg.picture = newMsg.sender.picture;

        this.messagesRepository.save(newMsg)
        this.server.emit('msgToClient', newMsg);
    }

    @SubscribeMessage('joinChannel')
    async joinChannel(client: Socket, channName: string): Promise<void>{
        client.join(channName)
        console.log(client.rooms)
        // this.server.emit('ConnectedToChannel', "You are in room " + client.adapter)
    }

    afterInit(server: Server){
        this.logger.log('Initialized ChatGateway');
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
        console.log('New connection, users count: ' + this.count + ' Socket id: ' + client.id);
        console.log('Socket Namespace: ' + client.nsp.name);
        // parse cookies
        const jwt_decoded = this.jwtService.decode(jwt.split('=')[1])

        let user_data = await this.usersRepository.findOne({
            where: {id: jwt_decoded['id']}
        })
        
        console.log(user_data)
    }
}
