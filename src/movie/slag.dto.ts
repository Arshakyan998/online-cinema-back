import { IsString } from 'class-validator'

export class SlagDto {
	@IsString({
		message: 'Must be a string',
	})
	slag: string
}
