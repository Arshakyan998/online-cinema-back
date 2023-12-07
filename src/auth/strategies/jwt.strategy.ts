import { Helper } from './../../Helper'
import { ConfigService } from '@nestjs/config'
import { Model } from 'mongoose'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { PassportStrategy } from '@nestjs/passport'
import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { User } from 'src/user/user.model'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor(
		private readonly configService: ConfigService,
		@InjectModel(User.name) private readonly userModel: Model<User>,
	) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: false,
			secretOrKey: configService.get('JWT_SECRET'),
		})
	}

	async validate({ _id }: { _id: string }) {
		const getUserById = await this.userModel.findById(_id)

		return Helper.removePasswordFromUser(getUserById)
	}
}
