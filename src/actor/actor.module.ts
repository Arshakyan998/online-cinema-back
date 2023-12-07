import { Module } from '@nestjs/common'
import { ActorService } from './actor.service'
import { ActorController } from './actor.controller'
import { MongooseModule } from '@nestjs/mongoose'
import { ActorModel, ActorSchema } from './actor.model'

@Module({
	controllers: [ActorController],
	imports: [
		MongooseModule.forFeatureAsync([
			{
				name: ActorModel.name,
				useFactory: () => {
					const schema = ActorSchema

					schema.post('save', () => {
						console.log('__ACTOR_REGISTERED__')
					})

					return schema
				},
			},
		]),
	],
	providers: [ActorService],
})
export class ActorModule {}
