import { MiddlewareConsumer, Module, NestModule, RequestMethod } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { TypeOrmModule } from "@nestjs/typeorm";
import { request } from "express";
import { User } from "src/entity/user.entity";
import { HasNickMiddleware, ValidTokenMiddleware }  from "src/middleware/account.middleware";

@Module({
  imports: [JwtModule.register({
      secret: process.env.JWT_SECRET, // bon faut le store secure et il faut le meme secret partout sah ptet faire un middleware
      signOptions: { expiresIn: '1w' },
    }),
  ]
})
export class ValidTokenModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
          .apply(ValidTokenMiddleware)
          .exclude('api/auth/(.*)')
          .forRoutes({ path: '*', method: RequestMethod.ALL })
    }
}

@Module({
  imports: [TypeOrmModule.forFeature([User]),
    JwtModule.register({
      secret: process.env.JWT_SECRET, // bon faut le store secure et il faut le meme secret partout sah ptet faire un middleware
      signOptions: { expiresIn: '1w' },
    }),
  ]
})
export class HasNickModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
      consumer
        .apply(HasNickMiddleware)
        .exclude('api/auth/(.*)', 'api/users/me/(.*)')
        .forRoutes({ path: '*', method: RequestMethod.ALL })
  }
}
