import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import slugify from 'slugify';

@Injectable()
export class SlugPipe implements PipeTransform {
    transform(value: string): string {
        if (!value) {
            throw new BadRequestException('Value for slug generation cannot be empty');
        }
        return slugify(value, { lower: true, strict: true }) + '-' + this.generateRandomString();
    }

    private generateRandomString(length: number = 6): string {
        return Math.random().toString(36).substring(2, 2 + length);
    }
}