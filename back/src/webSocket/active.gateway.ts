import {
  WebSocketGateway,
  SubscribeMessage,
  OnGatewayInit,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from "@nestjs/websockets";
import { Socket, Server } from 'socket.io';
import {  Logger } from "@nestjs/common";
import { Repository } from "typeorm";
import { JwtService } from '@nestjs/jwt';
import { AddUserIdMiddleware } from "src/middleware/account.middleware";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/entity/user.entity";

@WebSocketGateway({
  cors: {
    origin: "http://localhost:8000",
    credentials: true
  },
  middelwares: [ AddUserIdMiddleware ],
  namespace: '/active'
})
export class ActiveGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect{
  constructor(
      private jwtService : JwtService,
      @InjectRepository(User)
      private readonly usersRepository : Repository<User>,
      // @InjectRepository(Messages)
      // private readonly messagesRepository : Repository<Messages>,
      // @InjectRepository(PrivateMessage)
      // private readonly privateMessagesRepository : Repository<PrivateMessage>,
      // @InjectRepository(Channel)
      // private readonly ChannelsRepository : Repository<Channel>,
      // @InjectRepository(ChannelParticipant)
      // private readonly ChannelsParticipantsRepository : Repository<ChannelParticipant>,
    ) {}
    ClientConnected: Map<number, Socket> = new Map()
    // ClientConnected: Map<number, Socket> = new Map()
    
    @WebSocketServer() server: Server;
    private logger: Logger = new Logger('ActiveGateway');

  async handleDisconnect(client: Socket){
    this.server.emit("inactive", client['info'])
    console.log("disconnect Active")
    this.logger.log(`Client disconnected: ${client.id}`)
    this.usersRepository.update({
      id: client['info'].id } , {
        isActive: false
    })
  }

  afterInit(server: Server){
    this.logger.log('Init');
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
    console.log('Socket Namespace: ' + client.nsp.name);
    // parse cookies
    const jwt_decoded = this.jwtService.decode(jwt.split('=')[1])

    let user_data = await this.usersRepository.findOne({
        where: {id: jwt_decoded['id']}
    })
    client['info'] = user_data
    this.ClientConnected.set(user_data.id, client)
    this.server.emit("active", user_data.toLightuser())
    this.usersRepository.update({
      id: user_data.id } , {
        isActive: true
    })
    console.log(client['info'])
}
}