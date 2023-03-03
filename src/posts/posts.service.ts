import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Posts, PostsDocument } from './posts.model';
import { CreatePostsDto } from './dto/create-posts-dto';
import { UpdatePostsDto } from './dto/update-posts.dto';

@Injectable()
export class PostsService {
  // 在构造函数中进行依赖注入，这里保证 postsModel 是私有且只读的，无法被修改
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
