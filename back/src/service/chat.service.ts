import { JwtService } from "@nestjs/jwt"
import { Socket } from "socket.io"

export class ChatService {

  getJwt(client: Socket): any {
    const jwt = client.handshake.headers.cookie
    .split('; ')
    .find((cookie: string) => cookie.startsWith('jwt'))
    if (jwt == null)
    {
        client.disconnect()
        return
    }
    return jwt
  }
}