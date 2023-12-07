import {
	Body,
	Controller,
	HttpCode,
	Param,
	Put,
	UsePipes,
	ValidationPipe,
} from '@nestjs/common'
import { RatingService } from './rating.service'
import { Auth } from 'src/auth/decorators/auth.decorator'
import { User } from 'src/user/decorators/user.decorator'
import { Types } from 'mongoose'
import { SetRatingDto } from './dto/set-rating.dto'

@Controller('rating')
export class RatingController {
	constructor(private readonly ratingService: RatingService) {}

	@Put(':movieId')
	@Auth()
	async getProfile(
		@User('_id') id: Types.ObjectId,
		@Param('movieId') movieId: Types.ObjectId,
	) {
		return this.ratingService.getMovieValueByUser(id, movieId)
	}

	@Put('/set-rating/:movieId')
	@HttpCode(201)
	@Auth()
	@UsePipes(new ValidationPipe())
	async updateProfile(
		@User('_id') id: Types.ObjectId,
		@Body() dto: SetRatingDto,
	) {
		return this.ratingService.setRating(id, dto)
	}
}
