import { MiddlewareConsumer, Module, NestModule, RequestMethod } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "src/entity/user.entity";
import { TwoFaMiddleware } from "src/middleware/2fa.middleware";
import { AddUserIdMiddleware, HasNickMiddleware, ValidTokenMiddleware }  from "src/middleware/account.middleware";
import { CustomJwtModule } from "./custom.jwt.module";

@Module({
  imports: [ CustomJwtModule ]
})
export class AddUserIdModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AddUserIdMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL })
  }
}

const allmiddleware = [
  AddUserIdModule
]

@Module({
  imports: allmiddleware,
  exports: allmiddleware
})
export class AllMiddleware {}
