// 这个文件是定义 Posts 模型的结构

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PostsDocument = Posts & Document;

@Schema()
export class Posts extends Document {
  @Prop()
  title: string;

  @Prop()
  content: string;
}

export const PostsSchema = SchemaFactory.createForClass(Posts);
