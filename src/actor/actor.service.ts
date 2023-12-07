import {
	Injectable,
	NotFoundException,
	BadRequestException,
} from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { ActorModel } from './actor.model'
import { Model } from 'mongoose'
import { ActorDto } from './actor.dto'
import { MovieModel } from 'src/movie/movie.model'

@Injectable()
export class ActorService {
	constructor(
		@InjectModel(ActorModel.name)
		private readonly actorModel: Model<ActorModel>,
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

		const getActors = await this.actorModel
			.aggregate()
			.match(options)
			.lookup({
				from: MovieModel.name,
				localField: '_id',
				foreignField: 'actors',
				as: 'movies',
			})
			.addFields({
				countMovies: {
					$size: '$movies',
				},
			})
			.project({ __v: 0 })

		return {
			actors: getActors,
			length: getActors.length,
		}
	}

	async getCollections() {
		const getCollections = await this.actorModel.find()
		const collection = getCollections
		/*NEED WRITE A HEAD */
		return collection
	}

	/*ADMIN*/
	async update(id: string, dto: Partial<ActorDto>) {
		const updateActor = await this.actorModel.findByIdAndUpdate(id, dto, {
			new: true,
		})

		if (!updateActor) throw new NotFoundException('actor not found')

		return updateActor
	}

	async delete(id: string) {
		const deletedActor = await this.actorModel.findByIdAndDelete(id)

		if (!deletedActor) throw new BadRequestException('actor already deleted')

		return {
			success: true,
		}
	}

	async create(dto: ActorDto) {
		const actor = await this.actorModel.create(dto)

		return actor._id
	}

	async getBySlug(slug: string) {
		const getBySlag = await this.actorModel.findOne({ slug })

		if (!getBySlag) throw new NotFoundException('actor not found')

		return getBySlag
	}
}
