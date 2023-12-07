import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Model, RefType } from 'mongoose'
import { ActorModel } from 'src/actor/actor.model'
import { GenreModel } from 'src/genre/genere.model'

export class Parameters {
	@Prop()
	year: number
	@Prop()
	duration: number
	@Prop()
	country: string
}

@Schema({
	timestamps: true,
	collection: 'movies',
})
export class MovieModel extends Model {
	@Prop({ default: '' })
	poster: string

	@Prop({ default: '' })
	bigPoster: string

	@Prop({ default: '' })
	title: string

	@Prop({ default: '' })
	description: string

	@Prop({
		default: {
			type: Parameters,
		},
	})
	parameters: Parameters

	@Prop({
		unique: true,
		default: '',
	})
	slug: string

	@Prop({
		required: false,
		type: Number,
		default: 4.0,
	})
	rating: number

	@Prop({
		default: 0,
	})
	countOpen?: 0

	@Prop()
	videoUrl: string

	@Prop({
		ref: GenreModel.name,
	})
	genres: RefType[]

	@Prop()
	isSendTelegram?: boolean

	@Prop({
		ref: ActorModel.name,
	})
	actors: RefType[]
}

export const movieSchema = SchemaFactory.createForClass(MovieModel)
