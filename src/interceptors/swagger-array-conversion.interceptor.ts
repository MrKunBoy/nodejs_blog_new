import {
	CallHandler,
	ExecutionContext,
	Injectable,
	NestInterceptor,
} from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';

@Injectable()
export class SwaggerArrayConversion implements NestInterceptor {
	constructor(private readonly property_names: string[]) {}

	intercept(
		context: ExecutionContext,
		next: CallHandler<any>,
	): Observable<any> | Promise<Observable<any>> {
		const request: Request = context.switchToHttp().getRequest();

		for (const prop of this.property_names) {
			const raw = request.body[prop];

			if (typeof raw === 'string') {
				// Nếu là chuỗi, tách thành mảng
				request.body[prop] =
					raw.trim() === ''
						? []
						: raw
								.split(',')
								.map((v) => v.trim())
								.filter(Boolean);
			} else if (
				Array.isArray(raw) &&
				raw.length === 1 &&
				typeof raw[0] === 'string'
			) {
				const value = raw[0].trim();
				request.body[prop] =
					value === ''
						? []
						: raw[0]
								.split(',')
								.map((v) => v.trim())
								.filter(Boolean);
			}
		}

		return next.handle();
	}
}
