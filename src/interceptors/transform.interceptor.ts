import { RESPONSE_MESSAGE } from '@/decorator/auth.decorator';
import {
	Injectable,
	NestInterceptor,
	ExecutionContext,
	CallHandler,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
export interface Response<T> {
	statusCode: number;
	message?: string;
	data: any;
}
@Injectable()
export class TransformInterceptor<T>
	implements NestInterceptor<T, Response<T>>
{
	constructor(private reflector: Reflector) {}
	intercept(
		context: ExecutionContext,
		next: CallHandler,
	): Observable<Response<T>> {
		return next.handle().pipe(
			map((data) => {
				const response = context.switchToHttp().getResponse();
				const isFileUpload = response
					.getHeaders()
					['content-type']?.includes('multipart/form-data');

				if (isFileUpload) {
					return data; // Nếu là upload file thì trả về nguyên trạng
				}

				return {
					statusCode: response.statusCode,
					message:
						this.reflector.get<string>(
							RESPONSE_MESSAGE,
							context.getHandler(),
						) || '',
					data: data,
				};
			}),
		);
	}
}
