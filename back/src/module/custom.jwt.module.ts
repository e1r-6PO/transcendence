import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";

const jwt = JwtModule.register({
  secret: process.env.JWT_SECRET,
  signOptions: { expiresIn: '1w' },
})

@Module({
  imports: [ jwt ],
  exports: [ jwt ]
})
export class CustomJwtModule {}
