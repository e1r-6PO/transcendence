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
import { Repository } from "typeorm";
import { JwtService } from '@nestjs/jwt';
import { AddUserIdMiddleware } from "src/middleware/account.middleware";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/entity/user.entity";
import { Messages } from "src/entity/messages.entity"
import { Channel } from "src/entity/channel.entity";
import { ChannelParticipant } from "src/entity/channelParticipant.entity";
import { IoAdapter } from "@nestjs/platform-socket.io";
import { PrivateMessage } from "src/entity/privateMessage.entity";
import { ChatService } from "src/service/chat.service";

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
        private jwtService: JwtService,
        private chatService: ChatService,
        @InjectRepository(User)
        private readonly usersRepository : Repository<User>,
        @InjectRepository(Messages)
        private readonly messagesRepository : Repository<Messages>,
        @InjectRepository(PrivateMessage)
        private readonly privateMessagesRepository : Repository<PrivateMessage>,
        @InjectRepository(Channel)
        private readonly ChannelsRepository : Repository<Channel>,
        @InjectRepository(ChannelParticipant)
        private readonly ChannelsParticipantsRepository : Repository<ChannelParticipant>,
      ) {}

    count: number = 0;
    ClientConnected: Map<number, Socket> = new Map()

    @WebSocketServer() server: Server;
    private logger: Logger = new Logger('ChatGateway');

    @SubscribeMessage('privateMessageToServer')
    async handlePrivateMessage(client: Socket, av: string): Promise<void>{
        
        var newMsg: PrivateMessage = new PrivateMessage;
        
        const jwt = this.chatService.getJwt(client)
        const jwt_decoded = this.jwtService.decode(jwt.split('=')[1])
        var userTarget = await this.usersRepository.findOne({
            where: { nickName: av[1] }
        })
        if (!userTarget)
            return
        newMsg.sender = await this.usersRepository.findOne({
            where: { id: jwt_decoded['id'] }
        })
        newMsg.target = userTarget
        newMsg.message = av[0]
        newMsg.picture = 'http://localhost:8000/api/users/' + newMsg.sender.id + '/picture'
        newMsg.date = new Date()
        
        var socketTarget = this.ClientConnected.get(userTarget.id)
        if (socketTarget)
            this.server.to(socketTarget.id).emit("privateMessage", newMsg)
        this.privateMessagesRepository.save(newMsg)

    }

    @SubscribeMessage('msgToServer')
    async handleMessage(client: Socket, av: string): Promise<void>{
        var newMsg: Messages = new Messages;

        var chan = await this.ChannelsRepository.findOne({
            where: { channName: av[1] }
        })

        const jwt = this.chatService.getJwt(client)
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
        this.ClientConnected.delete(client['info'].id)
        this.count--;
        this.logger.log(`Client disconnected: ${client.id}`)
        console.log('User disconnected, users count: ' + this.count );
    }

    async handleConnection(client: Socket, ...args: any[]){
        
        const jwt = this.chatService.getJwt(client)
        const jwt_decoded = this.jwtService.decode(jwt.split('=')[1])
        this.count++;
        console.log('New connection, users count: ' + this.count + ' Socket id: ' + client.id);
        console.log('Socket Namespace: ' + client.nsp.name);

        let user_data = await this.usersRepository.findOne({
            where: {id: jwt_decoded['id']}
        })
        client['info'] = user_data
        this.ClientConnected.set(user_data.id, client)
        console.log(client['info'])
    }
}
