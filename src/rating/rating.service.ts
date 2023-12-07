import { Injectable } from '@nestjs/common'
import { RatingModel } from './raiting.model'
import { Model, Types } from 'mongoose'
import { InjectModel } from '@nestjs/mongoose'
import { MovieService } from 'src/movie/movie.service'
import { SetRatingDto } from './dto/set-rating.dto'

@Injectable()
export class RatingService {
	constructor(
		@InjectModel(RatingModel.name)
		private readonly ratingModel: Model<RatingModel>,

		private readonly movieService: MovieService,
	) {}

	async getMovieValueByUser(movieId: Types.ObjectId, userId: Types.ObjectId) {
		return (
			(
				await this.ratingModel.findOne({ movieId, userId }).select('value')
			).toObject() || 0
		)
	}

	// async updateRating(userId: Types.ObjectId, dto: SetRatingDto) {
	// 	return null
	// }

	async setRating(userId: Types.ObjectId, dto: SetRatingDto) {
		const { movieId } = dto
		const averageRating = await this.averageRatingByMovie(movieId)

		const newRating = await this.ratingModel.findOneAndUpdate(
			{ movieId, userId },
			{
				value: averageRating,
				movieId,
				userId,
			},
			{
				upsert: true,
				new: true,
				setDefaultsOnInsert: true,
			},
		)

		return newRating
	}

	async averageRatingByMovie(movieId: Types.ObjectId | string) {
		const ratingsMovie = await this.ratingModel
			.aggregate()
			.match({ movieId: new Types.ObjectId(movieId) })

		return (
			ratingsMovie.reduce((aggr, val) => aggr + val.value, 0) /
			ratingsMovie.length
		)
	}
}
