import { Module } from '@nestjs/common'
import { MessageService } from 'src/service/message.service';

@Module({
    imports: [],
    controllers: [],
    providers: [MessageService]
})
export class MessageModule {}