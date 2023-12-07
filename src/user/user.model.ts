import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Model, RefType } from 'mongoose'
import { MovieModel } from 'src/movie/movie.model'

@Schema({ timestamps: true })
export class User extends Model {
	@Prop({ unique: true })
	email: string

	@Prop()
	password: string

	@Prop({ default: false })
	isAdmin: boolean

	@Prop({ default: [], ref: MovieModel.name })
	favorites: RefType[]

	@Prop({ default: false })
	BOSS: boolean
}
export const UserSchema = SchemaFactory.createForClass(User)
