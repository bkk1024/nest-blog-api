import { Module } from '@nestjs/common';
import { PostsController } from './posts.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Posts, PostsSchema } from './posts.model';
import { PostsService } from './posts.service';

@Module({
  imports: [
    // 注册 posts 模型，这里可以传入多个模型
    MongooseModule.forFeature([{ name: Posts.name, schema: PostsSchema }]),
  ],
  controllers: [PostsController],
  providers: [PostsService], // 告诉程序，我们在这个模块内部提供一个 service 给到 PostsController 进行使用
})
export class PostsModule {}
