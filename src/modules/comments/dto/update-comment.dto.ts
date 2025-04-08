import { PartialType } from '@nestjs/swagger';
import { CreateCommentDto } from './create-comment.dto';
import { IsOptional, IsString } from 'class-validator';
import e from 'express';

// DTO for updating Comment
export class UpdateCommentDto extends PartialType(CreateCommentDto) {}
