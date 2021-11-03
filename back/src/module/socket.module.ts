import { Module } from "@nestjs/common";
import { AppGateway } from "src/webSocket/app.gateway";

@Module({
    providers: [ AppGateway ]
})
export class SocketModule {}
