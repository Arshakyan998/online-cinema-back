import { IsEmail, MinLength, IsString } from 'class-validator'

export class AuthDto {
	@IsEmail(
		{},
		{
			message: 'Email is not valid',
		},
	)
	email: string

	@MinLength(6, {
		message: 'Password must be at least 6 characters',
	})
	@IsString()
	password: string
}
