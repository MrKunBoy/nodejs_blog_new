import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
	Req,
	Query,
	ParseIntPipe,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { Comment, COMMENT_TYPE } from './schemas/comment.schema';
import {
	ApiBearerAuth,
	ApiBody,
	ApiOperation,
	ApiQuery,
	ApiTags,
} from '@nestjs/swagger';
import { RequestWithUser } from '@/types/requests.type';
import { ParseMongoIdPipe } from '@/pipes/parse-mongo-id.pipe';
import { ApiDocsPagination } from '@/decorator/swagger-form-daata.decorator';
import { SORT_TYPE } from '@/types/common.type';

@Controller('comments')
@ApiTags('comments')
@ApiBearerAuth('token')
export class CommentsController {
	constructor(private readonly comments_service: CommentsService) {}

	@Post()
	@ApiBody({
		schema: {
			type: 'object',
			properties: {
				target_id: {
					type: 'string',
					default: '67f3f195e0e8bb009f41ac50',
				},
				content: {
					type: 'string',
					default: 'Comment 1.1',
				},
				comment_type: {
					type: 'string',
					default: COMMENT_TYPE.POSTS,
				},
			},
			required: ['target_id', 'content', 'comment_type'],
		},
	})
	async create(
		@Req() { user }: RequestWithUser,
		@Body() create_comment_dto: CreateCommentDto,
	) {
		return await this.comments_service.create({
			...create_comment_dto,
			create_by: user._id,
		});
	}

	@Get()
	@ApiOperation({
		summary: 'Get comments of specific post with pagination',
	})
	@ApiDocsPagination(Comment.name)
	@ApiQuery({
		name: 'sort_type',
		required: false,
		enum: SORT_TYPE,
	})
	@ApiQuery({
		name: 'target_id',
		example: '67f3f195e0e8bb009f41ac50',
	})
	async getCommentsWithHierarchy(
		@Query('target_id', ParseMongoIdPipe) target_id: string,
		@Query('offset', ParseIntPipe) offset: number,
		@Query('limit', ParseIntPipe) limit: number,
		@Query('sort_type') sort_type: SORT_TYPE,
	) {
		// return this.comments_service.findAll(
		// 	{ target_id },
		// 	{ offset, limit, sort_type },
		// );
		return this.comments_service.getCommentsWithHierarchy(
			{ target_id },
			{ offset, limit, sort_type },
		);
	}

	@Get(':comment_id')
	@ApiOperation({
		summary: 'Get more sub comments of a comment',
	})
	@ApiDocsPagination(Comment.name)
	@ApiQuery({
		name: 'sort_type',
		required: false,
		enum: SORT_TYPE,
	})
	async getMoreSubComments(
		@Param('comment_id', ParseMongoIdPipe) comment_id: string,
		@Query('offset', ParseIntPipe) offset: number,
		@Query('limit', ParseIntPipe) limit: number,
		@Query('sort_type') sort_type: SORT_TYPE,
	) {
		return this.comments_service.findAll(
			{ parent_id: comment_id },
			{
				offset,
				limit,
				sort_type: sort_type || SORT_TYPE.ASC,
			},
		);
	}

	// Thích một bình luận
	@Patch('like/:comment_id')
	async like(@Param('id') id: string): Promise<Comment> {
		return this.comments_service.like(id);
	}

	// Không thích một bình luận
	@Patch('dislike/:comment_id')
	async dislike(@Param('id') id: string): Promise<Comment> {
		return this.comments_service.dislike(id);
	}

	@Delete(':id')
	@ApiOperation({ summary: 'Delete a comment' })
	remove(@Param('id', ParseMongoIdPipe) id: string) {
		return this.comments_service.remove(id);
	}
}
