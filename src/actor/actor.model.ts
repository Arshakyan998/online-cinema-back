import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Model } from 'mongoose'

@Schema({ timestamps: true, collection: 'actor' })
export class ActorModel extends Model {
	@Prop({ unique: true, default: '' })
	slug: string

	@Prop({ default: '' })
	name: string

	@Prop({ default: '' })
	photo: string
}
export const ActorSchema = SchemaFactory.createForClass(ActorModel)
