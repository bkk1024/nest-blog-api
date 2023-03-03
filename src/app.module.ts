import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PostsModule } from './posts/posts.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    PostsModule,
    // 连接 MongoDB 数据库
    MongooseModule.forRoot('mongodb://localhost:27017/nest-blog-api'),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
