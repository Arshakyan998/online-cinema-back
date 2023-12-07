import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Model, Types } from 'mongoose'
import { MovieModel } from 'src/movie/movie.model'
import { User } from 'src/user/user.model'

@Schema({
	timestamps: true,
	collection: 'rating',
})
export class RatingModel extends Model {
	@Prop({ unique: true, type: Number })
	value: number

	@Prop({ ref: User.name, type: Types.ObjectId })
	userId: Types.ObjectId

	@Prop({ ref: MovieModel.name })
	movieId: Types.ObjectId
}
export const RatingSchema = SchemaFactory.createForClass(RatingModel)
