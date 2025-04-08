import { BaseRepositoryInterface } from '@/repositories/base/base.interface.repository';
import { Comment } from '../schemas/comment.schema';
import { FindAllResponse } from '@/types/common.type';

export interface CommentsRepositoryInterface
	extends BaseRepositoryInterface<Comment> {
	getCommentsWithHierarchy(
		filter: object,
		options: object,
	): Promise<FindAllResponse<Comment>>;

	likeComment(id: string): Promise<Comment>;
	dislikeComment(id: string): Promise<Comment>;

	addReplyComment(parent_id: string, reply_id: string): Promise<Comment>;
	removeReplyComment(parent_id: string, reply_id: string): Promise<Comment>;
	softDeleteMany(ids: Array<string>): Promise<boolean>;
}
