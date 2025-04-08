import {
	IsEnum,
	IsMongoId,
	IsNotEmpty,
	IsOptional,
	IsString,
	MaxLength,
	MinLength,
} from 'class-validator';
import { ObjectId } from 'mongoose';
import { COMMENT_TYPE } from '../schemas/comment.schema';
import { User } from '@/modules/users/schemas/user.schema';
// DTO for Comment
export class CreateCommentDto {
	@IsNotEmpty()
	@IsMongoId()
	target_id: string;

	@IsEnum(COMMENT_TYPE)
	comment_type: COMMENT_TYPE;

	create_by: User | string | ObjectId;

	@IsString()
	@IsNotEmpty()
	@MinLength(1)
	@MaxLength(2000)
	content: string;

	@IsOptional()
	parent_id?: string | null;
}
