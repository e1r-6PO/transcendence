import { JwtService } from "@nestjs/jwt"
import { Socket } from "socket.io"

export class ChatService {
  constructor(
    private jwtService: JwtService
  ) {}

  async getJwt(client: Socket) {
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
    }
    catch (e) { client.disconnect(); return }
    return jwt
  }
}