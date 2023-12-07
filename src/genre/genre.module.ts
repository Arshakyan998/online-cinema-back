import { Module } from '@nestjs/common'
import { GenreService } from './genre.service'
import { GenreController } from './genre.controller'
import { MongooseModule } from '@nestjs/mongoose'
import { GenreSchema, GenreModel } from './genere.model'
import { MovieModule } from 'src/movie/movie.module'

@Module({
	imports: [
		MongooseModule.forFeatureAsync([
			{
				name: GenreModel.name,
				useFactory: () => {
					const schema = GenreSchema
					schema.post('save', function () {
						console.log('__GENRE_CREATED__')
					})
					return schema
				},
			},
		]),
		MovieModule,
	],
	controllers: [GenreController],
	providers: [GenreService],
})
export class GenreModule {}
