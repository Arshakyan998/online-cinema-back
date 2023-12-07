import { Model } from 'mongoose'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
@Schema({
	timestamps: true,
	collection: 'genre',
})
export class GenreModel extends Model {
	@Prop({ default: '' })
	name: string
	@Prop({ unique: true, default: '' })
	slug: string
	@Prop({ default: '' })
	description: string
	@Prop({ default: '' })
	icon: string
}

export const GenreSchema = SchemaFactory.createForClass(GenreModel)
