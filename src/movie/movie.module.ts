import { Module } from '@nestjs/common'
import { MovieService } from './movie.service'
import { MovieController } from './movie.controller'
import { MongooseModule } from '@nestjs/mongoose'
import { MovieModel, movieSchema } from './movie.model'
import { TelegramModule } from 'src/telegram/telegram.module'

@Module({
	imports: [
		MongooseModule.forFeatureAsync([
			{
				name: MovieModel.name,
				useFactory: () => {
					const schema = movieSchema
					schema.post('save', () => {
						console.log('__MOVIE__CREATED__')
					})

					return schema
				},
			},
		]),
		TelegramModule,
	],

	controllers: [MovieController],
	providers: [MovieService],
	exports: [MovieService],
})
export class MovieModule {}
