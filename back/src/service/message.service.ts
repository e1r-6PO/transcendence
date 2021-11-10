import { Injectable } from '@nestjs/common';
import { Message } from '../entity/message.entity';

@Injectable()
export class MessageService {

    public getAll = async (): Promise<Message[]> => {
        return Message.find();
    }

    public createMessage = async (sender: string, message: string): Promise<Message> => {
        const newMsg: Message = new Message(sender, message);
        return await newMsg.save();
    }

}
