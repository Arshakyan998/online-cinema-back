import { Module } from '@nestjs/common'
import { RatingService } from './rating.service'
import { RatingController } from './rating.controller'
import { RatingModel, RatingSchema } from './raiting.model'
import { MongooseModule } from '@nestjs/mongoose'
import { MovieModule } from 'src/movie/movie.module'

@Module({
	imports: [
		MongooseModule.forFeatureAsync([
			{
				name: RatingModel.name,
				useFactory: () => {
					const schema = RatingSchema
					return schema
				},
			},
		]),
		MovieModule,
	],
	controllers: [RatingController],
	providers: [RatingService],
})
export class RatingModule {}
