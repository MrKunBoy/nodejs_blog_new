import { Posts } from '@/modules/posts/schemas/post.schema';
import { IsMongoId, IsNotEmpty, IsString } from 'class-validator';

// DTO for Media
export class CreateMediaDto {
	post?: Posts[];

	@IsString()
	@IsNotEmpty()
	file_path: string;

	@IsString()
	@IsNotEmpty()
	file_type: string;
}
