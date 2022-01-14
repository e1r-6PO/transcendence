import { Entity } from "typeorm";

@Entity()
export class LightChannel {
  id: number;

  channName: string;

  channPass: string;

  channType: string;

  channAccess: string;
}