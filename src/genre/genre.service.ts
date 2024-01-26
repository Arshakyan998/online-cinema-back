import { MovieService } from 'src/movie/movie.service'
import {
	Injectable,
	BadRequestException,
	NotFoundException,
} from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { GenreModel } from './genere.model'
import { Model } from 'mongoose'
import { CreateGenreDto } from './dto/create-genre.dto'

@Injectable()
export class GenreService {
	constructor(
		@InjectModel(GenreModel.name)
		private readonly genreModel: Model<GenreModel>,

		private readonly movieService: MovieService,
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

		const getGenres = await this.genreModel.find(options).select('-__v')

		return {
			genres: getGenres,
			length: getGenres.length,
		}
	}

	async getCollections() {
		const getCollections = await this.genreModel.find()
		const collection = await Promise.all(
			getCollections.map(async (genre) => {
				const movieByGenres = await this.movieService.getByGenres([genre._id])

				const result = {
					_id: genre._id,
					name: genre.name,
					slug: genre.slug,
					image: movieByGenres[0].bigPoster,
				}
				return result
			}),
		)
		/*NEED WRITE A HEAD */
		return collection
	}

	/*ADMIN*/
	async update(id: string, dto: Partial<CreateGenreDto>) {
		const updateGenre = await this.genreModel.findByIdAndUpdate(id, dto, {
			new: true,
		})

		if (!updateGenre) throw new NotFoundException('Genre not found')

		return updateGenre
	}

	async delete(id: string) {
		const deletedGenre = await this.genreModel.findByIdAndDelete(id)

		if (!deletedGenre) throw new BadRequestException('Genre already deleted')

		return {
			success: true,
		}
	}

	async create(dto: CreateGenreDto) {
		const genre = await this.genreModel.create(dto)

		return genre._id
	}

	async getBySlug(slug: string) {
		const getBySlag = await this.genreModel.findOne({ slug })

		if (!getBySlag) throw new NotFoundException('Genre not found')

		return getBySlag
	}

	async getById(id: string) {
		const getDataById = await this.genreModel.findById(id)

		if (!getDataById) throw new NotFoundException('chka')

		return getDataById
	}
}
