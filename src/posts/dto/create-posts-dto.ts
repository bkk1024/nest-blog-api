import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

// 创建帖子的数据结构：DTO
export class CreatePostsDto {
  @ApiProperty({ description: '帖子标题', example: '帖子标题' }) // 描述参数：description是对这个参数的描述，example是这个参数的默认值
  @IsNotEmpty({ message: '标题不能为空' })
  title: string;

  @ApiProperty({ description: '帖子内容', example: '帖子内容' }) // 描述参数
  content: string;
}
