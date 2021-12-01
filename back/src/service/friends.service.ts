import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Friend_Status, Relationship } from "src/entity/relationship.entity";
import { Repository } from "typeorm";

@Injectable()
export class FriendsService {
  constructor(
    @InjectRepository(Relationship)
    private readonly relationShipRepository : Repository<Relationship>
  ) {}

  create_friend_request(sender_id, receiver_id) {
    let sender = new Relationship()
    sender.user = sender_id
    sender.peer = receiver_id
    sender.status = Friend_Status.sent

    let receiver = new Relationship()
    receiver.user = receiver_id
    receiver.peer = sender_id
    receiver.status = Friend_Status.incomming
    this.relationShipRepository.save(sender)
    this.relationShipRepository.save(receiver)
  }
}