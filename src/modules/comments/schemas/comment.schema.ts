import { User } from '@/modules/users/schemas/user.schema';
import { Posts } from '@/modules/posts/schemas/post.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { BaseSchema } from '@/modules/shared/base/base.schema';
import { NextFunction } from 'express';

export enum COMMENT_TYPE {
	POSTS = 'POSTS',
	SERIES = 'SERIES',
}

// Define the Comment document type
export type CommentDocument = HydratedDocument<Comment>;

@Schema({ timestamps: true, collection: 'comments' }) // Automatically adds createdAt and updatedAt fields
export class Comment extends BaseSchema {
	@Prop({
		type: mongoose.Types.ObjectId,
		required: true,
	})
	target_id: mongoose.Types.ObjectId | Posts; // | Series

	@Prop({
		enum: COMMENT_TYPE,
		required: true,
		default: COMMENT_TYPE.POSTS,
	})
	comment_type: COMMENT_TYPE;

	@Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
	create_by: User | mongoose.Types.ObjectId;

	@Prop({ required: true }) // Make content required
	content: string;

	@Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Comment', default: null }) // Support nested comments
	parent_id?: Comment | mongoose.Types.ObjectId;

	@Prop({
		type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
		default: [],
	})
	children_ids?: Comment[] | mongoose.Types.ObjectId[];

	@Prop({ default: 0 }) // Default like count is 0
	likes: number;

	@Prop({ default: 0 }) // Default dislike count is 0
	dislikes: number;
}

// Create the Comment schema
const schema = SchemaFactory.createForClass(Comment);

// CommentSchema.index({ post: 1 });
// CommentSchema.index({ author: 1 });
// CommentSchema.index({ parent_comment: 1 });

// CommentSchema.pre('find', function (next) {
// 	this.populate('post')
// 		.populate('author')
// 		.populate('parent_comment')
// 		.populate('replies');
// 	next();
// });

schema.pre('save', function (next: NextFunction) {
	if (this.parent_id) {
		this.parent_id = new mongoose.Types.ObjectId(
			this.parent_id as mongoose.Types.ObjectId,
		);
	}
	next();
});

export const CommentSchema = schema;
