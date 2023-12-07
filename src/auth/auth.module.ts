import { Module } from '@nestjs/common'
import { AuthService } from './auth.service'
import { AuthController } from './auth.controller'
import { User, UserSchema } from 'src/user/user.model'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { MongooseModule } from '@nestjs/mongoose'
import { JwtStrategy } from './strategies/jwt.strategy'
import { getJwtConfig } from 'src/config/jwt.config'
import { JwtModule } from '@nestjs/jwt'
@Module({
	providers: [AuthService, JwtStrategy],
	imports: [
		ConfigModule.forRoot(),

		MongooseModule.forFeatureAsync([
			{
				name: User.name,
				useFactory: () => {
					const schema = UserSchema
					schema.post('save', function () {
						console.log('__REGISTERED__')
					})
					return schema
				},
			},
		]),

		JwtModule.registerAsync({
			imports: [ConfigModule],
			useFactory: getJwtConfig,
			inject: [ConfigService],
		}),
	],
	controllers: [AuthController],
})
export class AuthModule {}
