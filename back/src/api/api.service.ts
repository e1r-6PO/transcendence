import { Injectable } from '@nestjs/common';
import { CreateApiDto } from './dto/create-api.dto';
import { UpdateApiDto } from './dto/update-api.dto';

@Injectable()
export class ApiService {
  version(/*createApiDto: CreateApiDto*/) {
    return { "version" : "0.01" }
  }
}
