import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
	Req,
	UploadedFile,
	BadRequestException,
	Query,
	ParseIntPipe,
	DefaultValuePipe,
	UseGuards,
	UseInterceptors,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import {
	ApiBearerAuth,
	ApiBody,
	ApiConsumes,
	ApiOperation,
	ApiParam,
	ApiQuery,
	ApiTags,
	getSchemaPath,
} from '@nestjs/swagger';
import { RequestWithUser } from '@/types/requests.type';
import {
	ApiBodyWithSingleFile,
	ApiDocsPagination,
} from '@/decorator/swagger-form-daata.decorator';
import { JwtAccessTokenGuard } from '@/auth/passport/guards/jwt-access-token.guard';
import MongooseClassSerializerInterceptor from '@/interceptors/mongoose-class-serializer.interceptor';
import { Posts } from './schemas/post.schema';
import mongoose from 'mongoose';
import { SwaggerArrayConversion } from '@/interceptors/swagger-array-conversion.interceptor';
import { FileInterceptor } from '@nestjs/platform-express';
import { LoggingInterceptor } from '@/interceptors/logging.interceptor';
import { generateNextKey } from '@/shared/helpers/pagination';

@Controller('posts')
@ApiBearerAuth('token')
@ApiTags('posts')
export class PostsController {
	constructor(private readonly postsService: PostsService) {}

	@Post()
	@ApiOperation({
		summary: 'User create a new post',
		description:
			'Creates a new post with the provided title, content, and excerpt.',
	})
	@ApiConsumes('multipart/form-data')
	@ApiBody({
		schema: {
			type: 'object',
			properties: {
				title: { type: 'string', default: 'Title 1' },
				content: { type: 'string', default: 'Content 1' },
				excerpt: { type: 'string', default: 'Excerpt content 1' },
				published: { type: 'boolean', default: true },
				categories: {
					type: 'array',
					items: { type: 'string', default: '' },
					default: ['67eb9584ddd3332f192f9119', '67eb95afddd3332f192f9120'],
				},
				tags: { type: 'array', items: { type: 'string', default: '' } },
				image: { type: 'string', format: 'binary' },
			},
			required: ['title', 'content', 'excerpt', 'published', 'image'],
		},
	})
	@UseInterceptors(new SwaggerArrayConversion(['categories', 'tags'])) // <--- Thêm vào đây
	@UseInterceptors(FileInterceptor('image'))
	@UseGuards(JwtAccessTokenGuard)
	async create(
		@Req() request: RequestWithUser,
		@UploadedFile() image: Express.Multer.File,
		@Body() createPostDto: CreatePostDto,
	) {
		return this.postsService.createPost(
			{
				...createPostDto,
				user: request.user,
			},
			image,
		);
	}

	@Get()
	@UseInterceptors(LoggingInterceptor)
	@ApiDocsPagination(Post.name)
	findAll(
		@Query('offset', new DefaultValuePipe(0), ParseIntPipe) offset: number,
		@Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
	) {
		return this.postsService.findAll({}, { offset, limit });
	}

	@Get('keyset-pagination')
	@ApiQuery({ name: 'last_id', required: false })
	@ApiQuery({ name: 'last_post', required: false })
	@ApiQuery({ name: 'search', required: false })
	@ApiQuery({ name: 'offset', required: false })
	@UseInterceptors(LoggingInterceptor)
	async findAllUsingKeysetPagination(
		@Query('last_post') last_post: string,
		@Query('search') search: string,
		@Query('last_id') last_id: string,
		@Query('limit', ParseIntPipe) limit: number,
		@Query('offset') offset: number,
	) {
		if (offset) {
			const { count, items } = await this.postsService.findAll(
				{ search },
				{
					offset,
					limit,
				},
			);
			return {
				count,
				items,
				next_key: generateNextKey(items, ['slug', 'title']),
			};
		}
		return this.postsService.findAllUsingKeysetPagination(
			{ search },
			{ last_id, last_post },
			{ limit },
		);
	}

	@Get(':id')
	async findOne(@Param('id') id: string) {
		return await this.postsService.findOne(id);
	}

	@Patch(':id')
	update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
		return this.postsService.update(id, updatePostDto);
	}

	@Delete(':id')
	remove(@Param('id') id: string) {
		return this.postsService.remove(id);
	}

	@Patch('queue/state')
	@ApiQuery({
		name: 'state',
		enum: ['PAUSE', 'RESUME'],
	})
	pauseOrResumeQueue(@Query('state') state: string) {
		return this.postsService.pauseOrResumeQueue(state);
	}

	@Post('seed-data')
	@ApiBearerAuth('token')
	@UseGuards(JwtAccessTokenGuard)
	seedFlashCards(@Req() { user }: RequestWithUser) {
		return this.postsService.seedData(user);
	}
}
