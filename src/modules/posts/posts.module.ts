import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { PostSchema, Posts } from './schemas/post.schema';
import { SlugPipe } from '@/pipes/slug.pipe';
import { PostRepository } from '@/repositories/posts.repository';
import { BullModule } from '@nestjs/bullmq';
import { ImageOptimizationProcessor } from './queues/image-optimization.processor';
import { ImageVerificationProcessor } from './queues/image-verification.processor';
import { ImageUploadingProcessor } from './queues/image-uploading.processor';
import { UploadFileServiceS3 } from '@/services/files/upload-file-s3.service';
import { UploadFileServiceAbstract } from '@/services/files/upload-file.abstract.service';

@Module({
	imports: [
		MongooseModule.forFeature([{ name: Posts.name, schema: PostSchema }]),
		BullModule.registerQueue({
			name: 'image-optimize',
			// prefix: 'posts',
		}),
		BullModule.registerQueue({
			name: 'image-check-valid',
			// prefix: 'posts',
		}),
		BullModule.registerQueue({
			name: 'image-upload',
			// prefix: 'posts',
		}),
		BullModule.registerFlowProducer({
			name: 'image-upload',
			// prefix: 'posts',
		}),
	],
	controllers: [PostsController],
	providers: [
		PostsService,
		SlugPipe,
		{ provide: 'PostRepositoryInterface', useClass: PostRepository },
		ImageOptimizationProcessor,
		ImageVerificationProcessor,
		ImageUploadingProcessor,
		{
			provide: UploadFileServiceAbstract,
			useClass: UploadFileServiceS3,
		},
	],
	exports: [PostsService],
})
export class PostsModule {}
