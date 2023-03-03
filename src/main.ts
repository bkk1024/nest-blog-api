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
  // 允许跨域
  // app.enableCors();

  const config = new DocumentBuilder()
    .setTitle('NestJs 博客API') // 标题
    .setDescription('我的第一个NestJs应用') // 描述
    .setVersion('1.0') // 设置版本
    // .addTag('posts') // 添加标签
    .build();
  const document = SwaggerModule.createDocument(app, config);
  // 三个参数：
  // 第一个参数：将接口文档挂载到哪个路径下
  SwaggerModule.setup('api-docs', app, document);

  await app.listen(5000);
}
bootstrap();
