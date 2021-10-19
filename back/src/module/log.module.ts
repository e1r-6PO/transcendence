import { MiddlewareConsumer, Module, NestModule, RequestMethod } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { request } from "express";
import { LogMiddleware } from "src/middleware/log.middleware";

@Module({
    imports: [
    JwtModule.register({
        secret: process.env.JWT_SECRET, // bon faut le store secure et il faut le meme secret partout sah ptet faire un middleware
        signOptions: { expiresIn: '1w' },
      }),
    ]
})
export class LogModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
          .apply(LogMiddleware)
          .exclude('api/auth/(.*)')
          .forRoutes({ path: '*', method: RequestMethod.ALL })
    }
}
