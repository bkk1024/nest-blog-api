// import { ApiProperty } from '@nestjs/swagger';
// import { IsNotEmpty } from 'class-validator';
import { PartialType } from '@nestjs/swagger';
import { CreatePostsDto } from './create-posts-dto';

// 更新帖子的数据结构：DTO
// export class CreatePostsDto {
//   @ApiProperty({ description: '帖子标题', example: '帖子标题，这是默认值' }) // 描述参数：description是对这个参数的描述，example是这个参数的默认值
//   @IsNotEmpty({ message: '标题不能为空' })
//   title: string;

//   @ApiProperty({ description: '帖子内容', example: '帖子内容，这是默认值' }) // 描述参数
//   content: string;
// }

export class UpdatePostsDto extends PartialType(CreatePostsDto) {}
/* 
    PartialType 返回我们传给它的类的类型，并将所有属性都设置为可选，这样我们就不用多写一些冗余的代码。
    PartialType 不仅标记所有字段都是可选的，而且它还继承了通过装饰器应用的所有验证规则，以及动态添加单个附加验证规则 @IsOptional() 到每个字段
   */
