import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { CommentsRepositoryInterface } from './interfaces/comments.interface';
import { BaseServiceAbstract } from '@/services/base/base.abstract.service';
import { Comment } from './schemas/comment.schema';
import { PostsService } from '../posts/posts.service';
import mongoose from 'mongoose';
import { SORT_TYPE } from '@/types/common.type';

@Injectable()
export class CommentsService extends BaseServiceAbstract<Comment> {
	constructor(
		@Inject('CommentsRepositoryInterface')
		private readonly comments_repository: CommentsRepositoryInterface,
		private readonly post_service: PostsService,
	) {
		super(comments_repository);
	}

	async create(create_comment_dto: CreateCommentDto) {
		// const target: Posts | Series = create_comment_dto.comment_type === COMMENT_TYPE.POSTS
		// 	? await this.post_service.findOne(create_comment_dto.target_id)
		// 	: await this.series_service.findOne(create_comment_dto.target_id)

		const target = await this.post_service.findOneByCondition({
			_id: create_comment_dto.target_id,
		});

		if (create_comment_dto.parent_id) {
			const parent = await this.comments_repository.findOneById(
				create_comment_dto.parent_id,
			);
			if (!parent) {
				throw new BadRequestException('Parent comment not found');
			}
			const parent_id = parent.parent_id ? parent.parent_id : parent._id;
			const comment = await this.comments_repository.create({
				...create_comment_dto,
				target_id: target._id,
				parent_id,
			});
			this.comments_repository.addReplyComment(
				parent_id as string,
				comment._id as string,
			);
			return comment;
		}
		return await this.comments_repository.create({
			...create_comment_dto,
			target_id: target._id,
		});
	}

	async findAll(
		filter: { parent_id: string },
		options: { offset: number; limit: number; sort_type: SORT_TYPE },
	) {
		console.log('filter: ', filter);

		const target = await this.comments_repository.findAll(
			{
				// ...filter,
				parent_id: new mongoose.Types.ObjectId(filter.parent_id),
			},
			{
				skip: options.offset,
				limit: options.limit,
				sort: {
					created_at: options.sort_type,
				},
			},
		);

		console.log(target);

		return target;
	}

	async getCommentsWithHierarchy(
		filter: { target_id: string },
		{ offset, limit, sort_type },
	) {
		return await this.comments_repository.getCommentsWithHierarchy(
			{ ...filter, parent_id: null },
			{
				offset,
				limit,
				sort_type,
			},
		);
	}

	async remove(id: string): Promise<boolean> {
		const comment = await this.comments_repository.findOneById(id);
		if (!comment) {
			return false;
		}
		if (comment.children_ids.length) {
			return await this.comments_repository.softDeleteMany([
				...(comment.children_ids as unknown as Array<string>),
				id,
			]);
		}
		if (comment.parent_id) {
			await this.comments_repository.removeReplyComment(
				comment.parent_id.toString(),
				id,
			);
		}
		return await this.comments_repository.softDelete(comment._id.toString());
	}

	// Thích một bình luận
	async like(id: string): Promise<Comment> {
		return this.comments_repository.likeComment(id);
	}

	// Không thích một bình luận
	async dislike(id: string): Promise<Comment> {
		return this.comments_repository.dislikeComment(id);
	}
}
