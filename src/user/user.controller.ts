import {
	Controller,
	Get,
	Put,
	Body,
	HttpCode,
	UsePipes,
	ValidationPipe,
	Param,
	Delete,
	Post,
} from '@nestjs/common'
import { UserService } from './user.service'
import { Auth } from 'src/auth/decorators/auth.decorator'
import { User } from './decorators/user.decorator'
import { User as UserModel } from './user.model'
import { idValidationPipe } from 'src/pipes/id.validation.pipe'
import { Types } from 'mongoose'

@Controller('users')
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Get('profile')
	@Auth()
	async getProfile(@User('_id') id: string) {
		return this.userService.byId(id)
	}

	@Put('profile')
	@HttpCode(201)
	@Auth()
	@UsePipes(new ValidationPipe())
	async updateProfile(
		@User('_id') id: string,
		@Body() dto: Partial<Omit<UserModel, 'favorite'>>,
	) {
		return this.userService.updateProfile(id, dto)
	}

	@Put(':id')
	@HttpCode(201)
	@Auth('admin')
	@UsePipes(new ValidationPipe())
	async user(
		@Param('id', idValidationPipe) id: string,
		@Body() dto: Partial<Omit<UserModel, 'favorite'>>,
	) {
		return this.userService.updateProfile(id, dto)
	}

	@Get()
	@Auth('BOSS')
	async getAllUsers(@Body('email') email?: string) {
		return this.userService.getAll(email)
	}

	@Delete(':id')
	@Auth('BOSS')
	async deleteUser(@Param('id', idValidationPipe) id: string) {
		return this.userService.deleteUser(id)
	}

	@Post('/toggle-favorite')
	@Auth()
	async toggleFavorite(@User() user, @Body('movieId') movieId: Types.ObjectId) {
		return this.userService.toggleFavorite(user, movieId)
	}

	@Get('/favorite')
	@Auth()
	async getFavorite(@User('id') id: Types.ObjectId) {
		return this.userService.getFavorites(id)
	}
}
