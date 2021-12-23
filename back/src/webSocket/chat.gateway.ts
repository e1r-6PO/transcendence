import {
    WebSocketGateway,
    SubscribeMessage,
    OnGatewayInit,
    WebSocketServer,
    OnGatewayConnection,
    OnGatewayDisconnect,
} from "@nestjs/websockets";
import { Socket, Server } from 'socket.io';
import { ForbiddenException, Logger } from "@nestjs/common";
import { AdvancedConsoleLogger, Repository } from "typeorm";
import { JwtService } from '@nestjs/jwt';
import cookieParser from "cookie-parser";
import { AddUserIdMiddleware } from "src/middleware/account.middleware";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/entity/user.entity";
import { Messages } from "src/entity/messages.entity"
import { Channel } from "src/entity/channel.entity";
import { ChannelParticipant } from "src/entity/channelParticipant.entity";
import { IoAdapter } from "@nestjs/platform-socket.io";

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
        private readonly messagesRepository : Repository<Messages>,
        @InjectRepository(Channel)
        private readonly ChannelsRepository : Repository<Channel>,
        @InjectRepository(ChannelParticipant)
        private readonly ChannelsParticipantsRepository : Repository<ChannelParticipant>,
      ) {}

    count: number = 0;

    @WebSocketServer() server: Server;
    private logger: Logger = new Logger('ChatGateway');

    @SubscribeMessage('msgToServer')
    async handleMessage(client: Socket, av: string): Promise<void>{
        var newMsg: Messages = new Messages;

        const jwt = client.handshake.headers.cookie
        .split('; ')
        .find((cookie: string) => cookie.startsWith('jwt'))
        if (jwt == null)
        {
            client.disconnect()
            return
        }

        var chan = await this.ChannelsRepository.findOne({
            where: { channName: av[1] }
        })
        // parse cookies
        const jwt_decoded = this.jwtService.decode(jwt.split('=')[1])

        newMsg.sender = await this.usersRepository.findOne({
            where: { id: jwt_decoded['id'] }
        })

        var participant = await this.ChannelsParticipantsRepository.findOne({
            where: { user: newMsg.sender, channel: chan }
        })
        if (!participant)
        {
            client.disconnect()
            return
        }
        var tmp = new Date()
        if (participant.isMute && participant.muteTime.getTime() > tmp.getTime())
        {
            this.server.to(client.id).emit('MuteError', 'You re mute until ' + participant.banTime.toString().slice(0,21).replace(/-/g,'/'))
            return
        }
        else
        {
            this.ChannelsParticipantsRepository.update({
                channel: chan, user: newMsg.sender
                }, {
                isMute: false, muteTime: new Date()
            })
        }
        newMsg.message = av[0];
        newMsg.time = new Date();
        newMsg.senderNick = newMsg.sender.nickName;
        newMsg.picture = newMsg.sender.picture;
        newMsg.channel = chan;

        this.messagesRepository.save(newMsg)
        this.server.to(av[1]).emit('msgToClient', newMsg);
    }

    @SubscribeMessage('joinChannel')
    async joinChannel(client: Socket, channName: string): Promise<void>{
        
        var chan = await this.ChannelsRepository.findOne({
            where: { channName: channName }
        })
        
        var participant = await this.ChannelsParticipantsRepository.findOne({
            where: { user: client['info'], channel: chan }
        })
        if (!participant)
        {
            client.disconnect()
            return
        }
        var tmp = new Date()
        if (participant.isBan && participant.banTime.getTime() > tmp.getTime())
        {
            client.disconnect()
            return
        }
        else
        {
            this.ChannelsParticipantsRepository.update({
                channel: chan, user: client['info']
                }, {
                isBan: false, banTime: new Date()
            })
        }
        client.join(channName)
        this.server.to(channName).emit("refreshUser")
        console.log(client.rooms)
        // this.server.emit('ConnectedToChannel', "You are in room " + client.adapter)
    }

    @SubscribeMessage('refreshUser')
    async refreshUser(client: Socket, channName: string): Promise<void> {
        setTimeout(() => {
            this.server.to(channName).emit("refreshUser")
        }, 200)
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
        client['info'] = user_data
        
        console.log(user_data)
    }
}
