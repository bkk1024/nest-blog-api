import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return '这是一个使用 NestJS 编写的简单 CRUD 案例';
  }
}
