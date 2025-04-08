import { Module } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { CommentSchema, Comment } from './schemas/comment.schema';
import { CommentRepository } from '@/repositories/comments.repository';
import { PostsModule } from '../posts/posts.module';

@Module({
	imports: [
		MongooseModule.forFeature([{ name: Comment.name, schema: CommentSchema }]),
		PostsModule,
	],
	controllers: [CommentsController],
	providers: [
		CommentsService,
		{ provide: 'CommentsRepositoryInterface', useClass: CommentRepository },
	],
	exports: [CommentsService],
})
export class CommentsModule {}
