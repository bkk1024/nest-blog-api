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
import { UpdatePostsDto } from './dto/update-posts.dto';

@Controller('posts')
@ApiTags('帖子')
export class PostsController {
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
