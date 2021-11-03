import { MiddlewareConsumer, Module, NestModule, RequestMethod } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "src/entity/user.entity";
import { HasNickMiddleware, ValidTokenMiddleware }  from "src/middleware/account.middleware";
import { CustomJwtModule } from "./custom.jwt.module";

@Module({
  imports: [ CustomJwtModule ]
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
  imports: [ TypeOrmModule.forFeature([User]), CustomJwtModule ]
})
export class HasNickModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(HasNickMiddleware)
      .exclude('api/auth/(.*)', 'api/profile/me/nickname')
      .forRoutes({ path: '*', method: RequestMethod.ALL })
  }
}

const allmiddleware = [
  ValidTokenModule,
  HasNickModule
]

@Module({
  imports: allmiddleware,
  exports: allmiddleware
})
export class AllMiddleware {}
