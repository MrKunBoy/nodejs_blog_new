import { PartialType } from '@nestjs/mapped-types';
import { CreatePostTagDto } from './create-post-tag.dto';

export class UpdatePostTagDto extends PartialType(CreatePostTagDto) {}
