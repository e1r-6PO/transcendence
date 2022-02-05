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
import { plainToClass } from "class-transformer";

@WebSocketGateway({
  cors: {
    origin: process.env.PROTOCOL + '://' + process.env.HOST,
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
    ) {}
    ClientConnected: Map<number, Socket> = new Map()
    
    @WebSocketServer() server: Server;
    private logger: Logger = new Logger('ActiveGateway');

  async handleDisconnect(client: Socket){
    client['info'].isActive = false
    this.server.emit("stateChanged", plainToClass(User, client['info']).toLightuser())
    this.logger.log(`Client disconnected: ${client.id}`)
    if (client['info'] != undefined && client['info'].id != undefined) {
      this.usersRepository.update({
        id: client['info'].id } , {
          isActive: false
      })
    }
  }

  afterInit(server: Server){
    this.logger.log('Init');
  }

  async handleConnection(client: Socket, ...args: any[]){
    var jwt: any
    try {
      const cookies = client.handshake.headers.cookie
      if (!cookies)
        throw 'no jwt'
      const sCookies = cookies.split('; ')
      if (!sCookies)
        throw 'no jwt'
      jwt = sCookies.find((cookie: string) => cookie.startsWith('jwt'))
      if (!jwt)
        throw 'no jwt'
			jwt = jwt.split('=')[1]
			if (!jwt)
				throw 'no jwt'
      await this.jwtService.verifyAsync(jwt)
    }
    catch (e) { client.disconnect(); return }
    // parse cookies
    const jwt_decoded = this.jwtService.decode(jwt)

    let user_data = await this.usersRepository.findOne({
        where: {id: jwt_decoded['id']}
    })
    client['info'] = user_data
    this.ClientConnected.set(user_data.id, client)
    user_data.isActive = true
    this.server.emit("stateChanged", user_data.toLightuser())
    this.usersRepository.update({
      id: user_data.id } , {
        isActive: true
    })
}
}