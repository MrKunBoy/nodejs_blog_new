import { ERRORS_DICTIONARY } from '@/constraints/error-dictionary.constraint';
import { BadRequestException } from '@nestjs/common';

import bcrypt from 'bcrypt';
const satlRound = 10;

export const hashContentHelper = async (plainPassword: string) => {
	try {
		return await bcrypt.hash(plainPassword, satlRound);
	} catch (error) {
		console.log(error);
	}
};

export const verifyPlainContentWithHashedContent = async (
	plainPassword: string,
	hashPassword: string,
) => {
	try {
		return await bcrypt.compare(plainPassword, hashPassword);
	} catch (error) {
		console.log(error);
		throw new BadRequestException({
			message: ERRORS_DICTIONARY.CONTENT_NOT_MATCH,
			details: 'Content hash not match!!',
		});
	}
};

export function escapeRegex(text: string): string {
	return text.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
}

export function removeSpecialCharacters(str: string): string {
	return str.replace(/[^a-zA-Z0-9À-ỹà-ỹ\s]/g, '');
}

export function generateSearchQuery(
	search: string,
	fields: string[],
): { $or: { [key: string]: any }[] } | Record<string, never> {
	if (!search || !search.trim() || fields.length === 0) return {};

	const escaped = removeSpecialCharacters(search);
	const regex = { $regex: `.*${escaped}.*`, $options: 'i' };

	return {
		$or: fields.map((field) => ({ [field]: regex })),
	};
}

export function isLastDayOfMonth(date: Date) {
	const last_day_of_month = new Date(
		date.getFullYear(),
		date.getMonth() + 1,
		0,
	).getDate();
	return date.getDate() === last_day_of_month;
}

export function isTheMonthOfSameYear(date_a: Date, date_b: Date) {
	return (
		date_a.getFullYear() === date_b.getFullYear() &&
		date_a.getMonth() === date_b.getMonth()
	);
}

export function isDifferentMonthOrYear(date_a: Date, date_b: Date) {
	return (
		date_a.getMonth() !== date_b.getMonth() ||
		date_a.getFullYear() !== date_b.getFullYear()
	);
}
