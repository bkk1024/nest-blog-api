# 一个使用 NestJs 编写的简单CRUD案例

## 前言

本案例来源于 [B站全栈之巅](https://www.bilibili.com/video/BV1U441117xK/?spm_id_from=333.999.0.0&vd_source=16ba8f2131220773e361fb00f3cb12fb) ，并针对 NestJs8.x版本做了部分修改。

## 创建项目

首先，保证电脑中已安装完成 NestJs-CLI、MongoDB、NodeJS等。

输入以下命令使用 Nest 脚手架创建项目：

`nest new nest-blog-api` 

## 创建一个 posts 模块

```
nest g mo posts // 创建 module
nest g co posts // 创建 controller
nest g s posts // 创建 service
```

## 项目代码

DTO：数据传输对象(Data Transfer Object)，是一种设计模式之间传输数据的软件应用系统。数据传输目标往往是[数据访问对象](https://baike.baidu.com/item/数据访问对象/3351868?fromModule=lemma_inlink)从数据库中检索数据。数据传输对象与数据交互对象或数据访问对象之间的差异是一个以不具有任何行为除了存储和检索的数据（访问和存取器）。

1. 在 posts 文件夹下创建 dto 文件夹

2. 创建 `create-posts-dto.ts` 文件：用于定义新创建的文章的数据结构。

   ```typescript
   /* create-posts-dto.ts */
   
   // @nestjs/swagger 这个包要和 swagger-ui-express 这个包一起搭配使用。这两个包的作用是自动根据编写的接口生成 swagger 文档，下面会详细说明
   import { ApiProperty } from '@nestjs/swagger';
   // 要使用 IsNotEmpty ，需要安装两个包：npm i --save class-validator class-transformer
   import { IsNotEmpty } from 'class-validator'
   
   export class CreatePostsDto {
     @ApiProperty({ description: '帖子标题', example: '帖子标题，这是默认值' }) // 描述参数：description是对这个参数的描述，example是这个参数的默认值
     @IsNotEmpty({ message: '标题不能为空' })// 这个装饰器用来限定 title 这个字段不能为空，当为空时，使用这个dto的接口会报错，并提示我们给这个装饰器传递的 message。同时需要在 main.ts 文件中使用全局管道 ValidationPipe。
     title: string;
   
     @ApiProperty({ description: '帖子内容', example: '帖子内容，这是默认值' }) // 描述参数
     content: string;
   }
   ```

3. 根据接口自动生成 swagger 文档

   - 首先要下载两个包：` npm i --save @nestjs/swagger swagger-ui-express` 

   - 在 `main.ts` 文件中导入并使用：

     ```typescript
     /* main.ts */
     
     import { NestFactory } from '@nestjs/core';
     import { AppModule } from './app.module';
     import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
     import { ValidationPipe } from '@nestjs/common';
     
     async function bootstrap() {
       const app = await NestFactory.create(AppModule);
     
       // 使用全局管道
       app.useGlobalPipes(
         new ValidationPipe({
           // whitelist: true, // 自动删除请求接口传入进来的不需要的参数
           // forbidNonWhitelisted: true, // 当请求接口传入进来不需要的参数时，将抛出错误
           // transform: true, // 对参数执行类型转换
         }),
       );
     
       const config = new DocumentBuilder()
         .setTitle('NestJs 博客API') // 标题
         .setDescription('我的第一个NestJs应用') // 描述
         .setVersion('1.0') // 版本
         // .addTag('posts') // 添加标签
         .build();
       const document = SwaggerModule.createDocument(app, config);
       // 三个参数：
       // 第一个参数：将接口文档挂载到哪个路由路径下
       SwaggerModule.setup('api-docs', app, document);
     
       await app.listen(5000);
     }
     bootstrap();
     ```

4. 连接 MongoDB，在 `app.module.ts` 文件中使用 `@nestjs/mongoose` 包中的方法进行连接，首先要先 `npm i --save @nestjs/mongoose mongoose `：

   ```typescript
   /* app.module.ts */
   
   import { Module } from '@nestjs/common';
   import { AppController } from './app.controller';
   import { AppService } from './app.service';
   // PostsModule 是创建的存入 MongoDB 数据库中的数据的模型，这里我们在 posts.module.ts 中进行定义
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
   ```

5. 新建 `posts.model.ts` 文件，并定义模型：

   ```typescript
   /* posts.model.ts */
   // 这个文件是定义 Posts 模型的结构
   
   import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
   import { Document } from 'mongoose';
   
   export type PostsDocument = Posts & Document;
   
   @Schema()
   export class Posts extends Document {
     @Prop() // 定义模型的参数
     title: string;
   
     @Prop()
     content: string;
   }
   
   export const PostsSchema = SchemaFactory.createForClass(Posts);
   ```

6. 在 `posts.module.ts` 文件中注册 posts 模型，以便在 service 中操作数据库时进行使用：

   ```typescript
   /* posts.module.ts */
   
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
     providers: [PostsService],
   })
   export class PostsModule {}
   ```

7. 在 `posts.controller.ts` 中编写接口：

   ```typescript
   /* posts.controller.ts */
   
   import {
     Body,
     Controller,
     Delete,
     Get,
     Param,
     Post,
     Put,
   } from '@nestjs/common';
   import { ApiOperation, ApiTags } from '@nestjs/swagger';
   import { PostsService } from './posts.service';
   import { CreatePostsDto } from './dto/create-posts-dto';
   // 这里导入了 UpdatePostsDto ，这是定义的更新文章时的数据结构，在下面会写
   import { UpdatePostsDto } from './dto/update-posts.dto';
   
   @Controller('posts')
   @ApiTags('帖子') // 设置这个路由在 API 文档中显示在哪个标签下
   export class PostsController {
     // 注入 service
     constructor(private readonly postsService: PostsService) {}
   
     @Get()
     @ApiOperation({ summary: '帖子列表' }) // 在接口文档中显示接口描述
     async findAll() {
       return await this.postsService.findAll();
     }
     
     @Get(':pageIndex/:pageSize')
     @ApiOperation({ summary: '分页获取帖子列表' })
     async findByPage(
       @Param('pageIndex') pageIndex: string,
       @Param('pageSize') pageSize: string,
     ) {
       return await this.postsService.findByPage(
         Number(pageIndex),
         Number(pageSize),
       );
     }
   
     @Post()
     @ApiOperation({ summary: '创建帖子' })
     // 使用 CreatePostsDto，给这个请求的 body 添加约束
     async create(@Body() createPostsDto: CreatePostsDto) {
       return await this.postsService.create(createPostsDto);
     }
   
     @Get(':id')
     @ApiOperation({ summary: '帖子详情' })
     async detail(@Param('id') id: string) {
       return await this.postsService.findOne(id);
     }
   
     @Put(':id')
     @ApiOperation({ summary: '编辑帖子' })
     async update(
       @Param('id') id: string,
       @Body() updatePostsDto: UpdatePostsDto,
     ) {
       return await this.postsService.update(id, updatePostsDto);
     }
   
     @Delete(':id')
     @ApiOperation({ summary: '删除帖子' })
     async remove(@Param('id') id: string) {
       return await this.postsService.remove(id);
     }
   }
   ```

8. 在 `posts.service.ts` 文件中编写相关数据库操作：

   ```typescript
   /* posts.service.ts */
   
   import { Injectable } from '@nestjs/common';
   import { Model } from 'mongoose';
   import { InjectModel } from '@nestjs/mongoose';
   // 导入 posts 模型
   import { Posts, PostsDocument } from './posts.model';
   import { CreatePostsDto } from './dto/create-posts-dto';
   import { UpdatePostsDto } from './dto/update-posts.dto';
   
   @Injectable()
   export class PostsService {
     // 在构造函数中进行依赖注入，这里保证 postsModel 是私有且只读的，无法被修改。完成依赖注入后，即可在方法中使用 this.postsModel.XXX 去使用相关 MongoDB 方法去操作数据库
     constructor(
       @InjectModel('Posts') private readonly postsModel: Model<PostsDocument>,
     ) {}
   
     /* 获取全部文章的列表 */
     async findAll() {
       return await this.postsModel.find().exec();
     }
     
     /* 分页获取文章列表 */
     async findByPage(pageIndex: number, pageSize: number) {
       return await this.postsModel
         .find()
         .limit(pageSize)
         .skip((pageIndex - 1) * pageSize);
       // .limit(number) 限制查询多少条数据
       // .skip(number) 跳过多少条数据
     }
   
     /* 创建一篇文章 */
     async create(createPostsDto: CreatePostsDto) {
       await this.postsModel.create(createPostsDto);
       return {
         success: true,
         data: createPostsDto,
       };
     }
   
     /* 获取某篇文章详情 */
     async findOne(id: string) {
       return await this.postsModel.findById(id);
     }
   
     /* 编辑某篇文章 */
     async update(id: string, updatePostsDto: UpdatePostsDto) {
       await this.postsModel.findByIdAndUpdate(id, updatePostsDto);
       return {
         success: true,
         data: updatePostsDto,
       };
     }
   
     /* 删除某篇文章 */
     async remove(id: string) {
       await this.postsModel.findByIdAndDelete(id);
       return {
         success: true,
       };
     }
   }
   ```

9. 定义 `UpdatePostsDto` ，在 `update-posts-dto.ts` 文件中定义：

   ```typescript
   // import { ApiProperty } from '@nestjs/swagger';
   // import { IsNotEmpty } from 'class-validator';
   // 更新帖子的数据结构：DTO
   // 可以看出，这里的数据结构跟 CreatePostsDto 一样，所以我们可以用下面这种写法来减少代码冗余
   // export class CreatePostsDto {
   //   @ApiProperty({ description: '帖子标题', example: '帖子标题，这是默认值' }) // 描述参数：description是对这个参数的描述，example是这个参数的默认值
   //   @IsNotEmpty({ message: '标题不能为空' })
   //   title: string;
   
   //   @ApiProperty({ description: '帖子内容', example: '帖子内容，这是默认值' }) // 描述参数
   //   content: string;
   // }
   
   
   import { PartialType } from '@nestjs/swagger';
   import { CreatePostsDto } from './create-posts-dto';
   export class UpdatePostsDto extends PartialType(CreatePostsDto) {}
   /* 
       PartialType 返回我们传给它的类的类型，并将所有属性都设置为可选，这样我们就不用多写一些冗余的代码。
       PartialType 不仅标记所有字段都是可选的，而且它还继承了通过装饰器应用的所有验证规则，以及动态添加单个附加验证规则 @IsOptional() 到每个字段
   */
   ```

## 文档引用

[连接MongoDB](https://docs.nestjs.cn/8/techniques?id=mongo) 

[模型注入](https://docs.nestjs.cn/8/techniques?id=模型注入) 

[字段验证 ValidationPipe()](https://docs.nestjs.cn/8/techniques?id=验证) 

[自动生成 swagger 文档](https://docs.nestjs.cn/8/recipes?id=swagger) 

























