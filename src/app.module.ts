import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { AuthModule } from './auth/auth.module'
import { UserModule } from './user/user.module'
import { MongooseModule } from '@nestjs/mongoose'
import { getMongoDbConfig } from './config/mongo.config'
import { GenreModule } from './genre/genre.module'
import { FileModule } from './file/file.module'
import { ActorModule } from './actor/actor.module'
import { MovieModule } from './movie/movie.module'
import { RatingModule } from './rating/rating.module'
import { TelegramModule } from './telegram/telegram.module'

@Module({
	imports: [
		ConfigModule.forRoot(),
		MongooseModule.forRootAsync({
			imports: [ConfigModule],
			useFactory: (config) => {
				console.log('__CONNECTED__')

				return getMongoDbConfig(config)
			},
			inject: [ConfigService],
		}),

		AuthModule,
		UserModule,
		GenreModule,
		FileModule,
		ActorModule,
		MovieModule,
		RatingModule,
		TelegramModule,
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
