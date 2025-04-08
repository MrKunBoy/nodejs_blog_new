import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseRepositoryAbstract } from './base/base.abstract.repository';
import { Posts, PostDocument } from '@/modules/posts/schemas/post.schema';
import { PostRepositoryInterface } from '@/modules/posts/interfaces/posts.interface';

@Injectable()
export class PostRepository
	extends BaseRepositoryAbstract<PostDocument>
	implements PostRepositoryInterface
{
	constructor(
		@InjectModel(Posts.name)
		private readonly post_model: Model<PostDocument>,
	) {
		super(post_model);
	}
}
