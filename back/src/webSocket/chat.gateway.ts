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
import { Messages, Messages_type } from "src/entity/messages.entity"
import { Channel } from "src/entity/channel.entity";
import { ChannelParticipant } from "src/entity/channelParticipant.entity";
import { IoAdapter } from "@nestjs/platform-socket.io";
import { PrivateMessage } from "src/entity/privateMessage.entity";
import { ChatService } from "src/service/chat.service";
import { AchievementsService } from "src/service/achievements.service";
import { LightUser } from "src/entity/lightuser.entity";

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
        private achievementService: AchievementsService,
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
        
        const dest = av[0]
        const sender = av[1]
        const msg = av[2]

        if (msg.length > 180)
        {
            this.server.to(client.id).emit("error", "Message is too long")
            return
        }
        var newMsg: PrivateMessage = new PrivateMessage;
        
        const jwt = await this.chatService.getJwt(client)
        if (!jwt)
            return
        const jwt_decoded = this.jwtService.decode(jwt)
        var userTarget = await this.usersRepository.findOne({
            where: { nickName: dest }
        })
        if (!userTarget)
            return
        newMsg.sender = await this.usersRepository.findOne({
            where: { id: jwt_decoded['id'] }
        })
        newMsg.target = userTarget
        newMsg.message = msg
        newMsg.picture = 'http://localhost:8000/api/users/' + newMsg.sender.id + '/picture'
        newMsg.date = new Date()
        
        newMsg = await this.privateMessagesRepository.save(newMsg)
        
        var socketTarget = this.ClientConnected.get(userTarget.id)
        if (socketTarget)
            this.server.to(socketTarget.id).emit("privateMessage", newMsg)
        this.server.to(client.id).emit("privateMessage", newMsg)
        this.achievementService.sendMsgAchievement(newMsg.sender)

    }

    @SubscribeMessage('msgToServer')
    async handleMessage(client: Socket, av: string): Promise<void>{
        var newMsg: Messages = new Messages;

        if (av[0].length >= 180)
        {
            this.server.to(client.id).emit("error", "Message is too long")
            return
        }

        var chan = await this.ChannelsRepository.findOne({
            where: { channName: av[1] }
        })

        const jwt = await this.chatService.getJwt(client)
        if (!jwt)
            return
        const jwt_decoded = this.jwtService.decode(jwt)

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
        newMsg.type = Messages_type.default

        this.messagesRepository.save(newMsg)
        this.achievementService.sendMsgAchievement(newMsg.sender)
        this.server.to(av[1]).emit('msgToClient', newMsg);
    }

    @SubscribeMessage('joinChannel')
    async joinChannel(client: Socket, av: any): Promise<void>{
        
        var chan = await this.ChannelsRepository.findOne({
            where: { channName: av[0] }
        })
        
        var participant = await this.ChannelsParticipantsRepository.findOne({
            where: { user: client['info'], channel: chan }
        })
        if (participant)
        {
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
        }
        client.join(av[0])
        if (av[1] && av[1] == "join")
        {
            var servMsg = new Messages()

            servMsg.sender = client['info']
            servMsg.type = Messages_type.server
            servMsg.message = "User <" + client['info'].nickName + "> has join the channel."
            servMsg.channel = chan
            this.server.to(av[0]).emit("serverMsg", servMsg)
            this.server.to(av[0]).emit("newUser", client['info'])
            this.messagesRepository.save(servMsg)
        }
        this.server.to(av[0]).emit("refreshUser")
        console.log(client.rooms)
        // this.server.emit('ConnectedToChannel', "You are in room " + client.adapter)
    }

    @SubscribeMessage('userLeaveChannel')
    async userLeaveChannel(client: Socket, channName: string) {
      
      var chan = await this.ChannelsRepository.findOne({
        where: { channName: channName }
      })

      var userLeave = this.ClientConnected.get(client['info'].id)['info']
      var servMsg = new Messages()
      servMsg.sender = client['info']
      servMsg.type = Messages_type.server
      servMsg.message = "User <" + client['info'].nickName + "> has left the channel."
      servMsg.channel = chan
      this.server.to(channName).emit("serverMsg", servMsg)
      this.server.to(channName).emit("removeUser", userLeave)
      this.messagesRepository.save(servMsg)
    }

    @SubscribeMessage('userAdd')
    async userAdd(client: Socket, av: any) {
      
			if (!av[0] || !av[1])
					return
			var chan = await this.ChannelsRepository.findOne({
					where: { channName: av[0] }
			})

			let user_data = await this.usersRepository.findOne({
					where: { nickName: av[1] }
			})

      var servMsg = new Messages()
      servMsg.sender = client['info']
      servMsg.type = Messages_type.server
      servMsg.message = client['info'].nickName + " has add <" + av[1] + "> in the channel."
      servMsg.channel = chan
      this.server.to(av[0]).emit("serverMsg", servMsg)
      this.server.to(av[0]).emit("newUser", user_data.toLightuser())
      setTimeout(() => {
        var socketTarget = this.ClientConnected.get(user_data.id)
        if (socketTarget)
            this.server.to(socketTarget.id).emit("addMe", user_data.id, chan.toLightChannel())
			}, 200)
      this.messagesRepository.save(servMsg)
    }

    @SubscribeMessage('refreshUser')
    async refreshUser(client: Socket, channName: string): Promise<void> {
        setTimeout(() => {
            this.server.to(channName).emit("refreshUser")
        }, 200)
    }

    @SubscribeMessage('newOwner')
    async newOwner(client: Socket, av: string): Promise<void> {
        let user_data = await this.usersRepository.findOne({
            where: {nickName: av[1]}
        })
        setTimeout(() => {
            this.server.to(av[0]).emit("newOwner", user_data.id)
        }, 200)
    }

    @SubscribeMessage('switchGrade')
    async switchGrade(client: Socket, av: string): Promise<void> {
        let user_data = await this.usersRepository.findOne({
            where: { nickName: av[1] }
        })
        setTimeout(() => {
            this.server.to(av[0]).emit("switchGrade", user_data.id)
        }, 200)
    }

    @SubscribeMessage('deleteUser')
    async deleteUser(client: Socket, av: string): Promise<void> {
    
        if (!av[0] || !av[1])
        return
        var chan = await this.ChannelsRepository.findOne({
            where: { channName: av[0] }
        })
        let user_data = await this.usersRepository.findOne({
            where: { nickName: av[1] }
        })
        var servMsg = new Messages()
        servMsg.sender = client['info']
        servMsg.type = Messages_type.server
        servMsg.message = client['info'].nickName + " has kick <" + av[1] + "> of the channel."
        servMsg.channel = chan
        this.server.to(av[0]).emit("serverMsg", servMsg)
        this.server.to(av[0]).emit("removeUser", user_data.toLightuser())
        setTimeout(() => {
            this.server.to(av[0]).emit("kickMe", user_data.id, chan.channName)
            var socketTarget = this.ClientConnected.get(user_data.id)
            if (socketTarget)
                this.server.to(socketTarget.id).emit("kickMe", user_data.id, chan.channName)
    }, 200)
        this.messagesRepository.save(servMsg)
    }

    @SubscribeMessage('deleteChannel')
    async deleteChannel(client: Socket, channName: string) {
        client.to(channName).emit('ChannelDelete', client['info'].nickName);
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
        
        const jwt = await this.chatService.getJwt(client)
        if (!jwt)
            return
        const jwt_decoded = this.jwtService.decode(jwt)
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
