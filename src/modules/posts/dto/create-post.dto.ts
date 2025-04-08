import { PublicFile } from '@/modules/shared/upload-files/public-files.entity';
import { User } from '@/modules/users/schemas/user.schema';
import { Transform } from 'class-transformer';
import {
	IsNotEmpty,
	IsOptional,
	IsString,
	IsBoolean,
	IsArray,
} from 'class-validator';
import { ObjectId } from 'mongoose';
export class CreatePostDto {
	user?: User;

	@IsString()
	@IsNotEmpty()
	title: string;

	@IsString()
	@IsOptional()
	content: string;

	@IsOptional()
	@IsString()
	excerpt?: string;

	@IsBoolean()
	@Transform(({ value }) => value === 'true')
	published?: boolean;

	image: PublicFile;

	@IsOptional()
	@IsArray()
	// @Type(() => mongoose.Schema.Types.ObjectId)
	categories?: string[] | ObjectId[];

	@IsOptional()
	@IsArray()
	tags?: string[] | ObjectId[];
}
