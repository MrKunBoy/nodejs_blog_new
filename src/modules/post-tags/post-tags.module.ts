import { Module } from '@nestjs/common';
import { PostTagsService } from './post-tags.service';
import { PostTagsController } from './post-tags.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { PostTag, PostTagSchema } from './schemas/post-tag.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: PostTag.name, schema: PostTagSchema }])],
  controllers: [PostTagsController],
  providers: [PostTagsService],
  exports: [PostTagsService],
})
export class PostTagsModule {}
