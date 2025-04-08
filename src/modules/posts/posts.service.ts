import { Inject, Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { Posts } from './schemas/post.schema';
import mongoose from 'mongoose';
import { SlugPipe } from '@/pipes/slug.pipe';
import { FindAllResponse } from '@/types/common.type';
import { PostRepositoryInterface } from './interfaces/posts.interface';
import { BaseServiceAbstract } from '@/services/base/base.abstract.service';
import { generateNextKey } from '@/shared/helpers/pagination';
import { FlowProducer, Queue } from 'bullmq';
import * as fs from 'fs';
import { generateSearchQuery } from '@/shared/helpers/utils';
import { User } from '../users/schemas/user.schema';
import { join } from 'path';
import { InjectFlowProducer, InjectQueue } from '@nestjs/bullmq';

@Injectable()
export class PostsService extends BaseServiceAbstract<Posts> {
	constructor(
		@Inject('PostRepositoryInterface')
		private readonly postRepository: PostRepositoryInterface,
		private readonly slugPipe: SlugPipe,
		@InjectQueue('image-optimize')
		private readonly image_optimize_queue: Queue,
		@InjectFlowProducer('image-upload')
		private readonly image_upload_flow: FlowProducer,
	) {
		super(postRepository);
	}
	async createPost(
		createPostDto: CreatePostDto,
		file: Express.Multer.File,
	): Promise<Posts> {
		const newPost = await this.postRepository.create({
			...createPostDto,
			slug: this.slugPipe.transform(createPostDto.title),
		});

		await this.image_upload_flow.add({
			name: 'uploading-image',
			queueName: 'image-upload',
			data: {
				id: newPost._id,
				user_id: createPostDto.user._id,
				full_name: `${createPostDto.user.first_name} ${createPostDto.user.last_name}`,
				file_name: `${this.slugPipe.transform(createPostDto.title)}-${newPost._id}`,
			},
			children: [
				{
					name: 'optimize-size',
					// data: { file },
					data: {
						file: {
							mimetype: file.mimetype,
							originalname: file.originalname,
							buffer: Array.from(file.buffer), // Chuyển Buffer sang mảng để serialize
						},
					},
					queueName: 'image-optimize',
					opts: {
						delay: 2000,
					},
				},
				{
					name: 'check-term',
					data: { file },
					queueName: 'image-check-valid',
				},
				{
					name: 'check-policy',
					data: { file },
					queueName: 'image-check-valid',
				},
			],
		});

		return newPost;
	}

	async findAll(
		filter?: object,
		options?: { offset: number; limit: number },
	): Promise<FindAllResponse<Posts>> {
		return await this.postRepository.findAll(filter, {
			skip: options.offset,
			limit: options.limit,
			sort: { slug: 1, _id: 1 },
		});
	}

	async findAllUsingKeysetPagination(
		filter: { search: string },
		{ last_id, last_post }: { last_post: string; last_id: string },
		options?: { limit: number },
	): Promise<FindAllResponse<Posts>> {
		const pagination_query: any = {};
		let api_query: any = {};
		let final_query = {};
		if (last_id && last_post) {
			pagination_query['$or'] = [
				{
					slug: { $gt: last_post },
				},
				{
					slug: last_post,
					_id: { $gt: new mongoose.Types.ObjectId(last_id) },
				},
			];
		}

		if (filter?.search) {
			api_query = {
				...generateSearchQuery(filter.search, ['title', 'content']),
			};
		}

		if (Object.keys(api_query).length && Object.keys(pagination_query).length) {
			console.log(api_query);

			final_query['$and'] = [api_query, pagination_query];
		} else if (Object.keys(api_query).length) {
			final_query = api_query;
		} else if (Object.keys(pagination_query).length) {
			final_query = pagination_query;
		}

		const [{ items }, count] = await Promise.all([
			this.postRepository.findAll(final_query, {
				limit: options.limit,
				sort: { slug: 1, _id: 1 },
			}),
			this.postRepository.count(final_query),
		]);

		return {
			count,
			items,
			next_key: generateNextKey(items, ['slug', 'title']),
		};
	}

	async pauseOrResumeQueue(state: string) {
		if (state !== 'RESUME') {
			return await this.image_optimize_queue.pause();
		}
		return await this.image_optimize_queue.resume();
	}

	async seedData(user: User): Promise<{ message: string }> {
		const insert_data: Posts[] = [];
		try {
			const file_content = fs.readFileSync(
				join(__dirname, '../../../words_dictionary.json'),
				{
					encoding: 'utf-8',
					flag: 'r',
				},
			);

			Object.keys(JSON.parse(file_content)).map((keyword) =>
				insert_data.push({
					title: keyword,
					content: keyword,
					excerpt: keyword,
					slug: keyword,
					image: {
						key: keyword,
						url: keyword,
					},
					published: true,
					user,
					views: 0,
					tags: [],
					categories: ['67eb9584ddd3332f192f9117'],
				}),
			);
			await this.postRepository.insertMany(insert_data);
			return { message: 'done' };
		} catch (error) {
			console.log(error);
			throw error;
		}
	}
}
