import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PostTagsService } from './post-tags.service';
import { CreatePostTagDto } from './dto/create-post-tag.dto';
import { UpdatePostTagDto } from './dto/update-post-tag.dto';

@Controller('post-tags')
export class PostTagsController {
  constructor(private readonly postTagsService: PostTagsService) {}

  @Post()
  create(@Body() createPostTagDto: CreatePostTagDto) {
    return this.postTagsService.create(createPostTagDto);
  }

  @Get()
  findAll() {
    return this.postTagsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postTagsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePostTagDto: UpdatePostTagDto) {
    return this.postTagsService.update(+id, updatePostTagDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.postTagsService.remove(+id);
  }
}
