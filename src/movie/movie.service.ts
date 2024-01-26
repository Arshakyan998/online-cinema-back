import {
	Injectable,
	NotFoundException,
	BadRequestException,
} from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model, Types } from 'mongoose'
import { MovieModel } from './movie.model'
import { CreateMovieDto } from './create-movie.dto'
import { TelegramService } from 'src/telegram/telegram.service'

@Injectable()
export class MovieService {
	constructor(
		@InjectModel(MovieModel.name)
		private readonly movieModel: Model<MovieModel>,
		private readonly telegramService: TelegramService,
	) {}

	async getAll(searchParam?: string) {
		let options = {}
		if (searchParam) {
			options = {
				$or: [
					{
						name: new RegExp(searchParam, 'i'),
					},
					{
						slug: new RegExp(searchParam, 'i'),
					},
					{
						description: new RegExp(searchParam, 'i'),
					},
				],
			}
		}

		const getMovies = await this.movieModel
			.find(options)
			.select('-__v')
			.populate({ path: 'actors', select: 'name _id' })
			.sort({ rating: 'desc' })

		return {
			movies: getMovies,
			length: getMovies.length,
		}
	}

	async getCollections() {
		const getCollections = await this.movieModel.find()
		const collection = getCollections
		/*NEED WRITE A HEAD */
		return collection
	}

	/*ADMIN*/
	async update(id: string, dto: Partial<CreateMovieDto>) {
		/*Telegra notification*/

		//await this.sendNotification(dto as CreateMovieDto)

		// if (typeof dto.parameters[string] !== typeof Parameters) {

		//     throw new BadRequestException('Wrong parameters')
		// }

		const updateMovie = await this.movieModel.findByIdAndUpdate(id, dto, {
			new: true,
		})

		if (!updateMovie) throw new NotFoundException('Movie not found')

		return updateMovie
	}

	async delete(id: string) {
		const deletedMovie = await this.movieModel.findByIdAndDelete(id)

		if (!deletedMovie) throw new BadRequestException('Movie already deleted')

		return {
			success: true,
		}
	}

	async create(dto: CreateMovieDto) {
		const movie = await this.movieModel.create(dto)

		return movie._id
	}

	async getBySlug(slug: string) {
		const getBySlag = await this.movieModel
			.findOne({ slug })
			.populate('actors genres')

		if (!getBySlag) throw new NotFoundException('Movies not found')

		return getBySlag
	}

	async getByActor(actorsId: string) {
		const getByActor = await this.movieModel.findById(actorsId)

		if (!getByActor) throw new NotFoundException('Movies not found')

		return getByActor
	}

	async getByGenres(genreId: Types.ObjectId[]) {
		const getByActor = await this.movieModel.find({ genres: { $in: genreId } })

		if (!getByActor) throw new NotFoundException('Movies not found')

		return getByActor
	}

	async updateCountOpened(slug: string) {
		const updateMovie = await this.movieModel.findOneAndUpdate(
			{ slug },
			{
				$inc: {
					countOpen: 1,
				},
			},
			{ new: true },
		)

		if (!updateMovie) throw new NotFoundException('Movie not found')

		return updateMovie
	}

	async getMostPopular() {
		const getMostPopular = await this.movieModel
			.find({ countOpen: { $gt: 0 } })
			.populate('actors')
			.sort({ countOpen: 1 })

		return getMostPopular
	}

	async sendNotification(dto: CreateMovieDto) {
		if (process.env.NODE_ENV !== 'development') {
		}
		await this.telegramService.sendPhoto(
			'https://hips.hearstapps.com/hmg-prod/images/gettyimages-1061959920.jpg?crop=1xw:1.0xh;center,top&resize=640:*',
		)
		const msg = `<b>${dto.title}</b>\n`

		await this.telegramService.sendMessage(msg, {
			reply_markup: {
				inline_keyboard: [
					[
						{
							text: 'Watch trailer',
							url: ' dto.videoUrl',
						},
					],
				],
			},
		})
	}

	async getById(id: string) {
		const getMovie = await this.movieModel.findById(id)

		if (!getMovie) return new NotFoundException('Move not found')

		return getMovie
	}
}
