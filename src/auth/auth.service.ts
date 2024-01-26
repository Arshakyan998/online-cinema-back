import {
	Injectable,
	BadRequestException,
	UnauthorizedException,
} from '@nestjs/common'
import { User } from 'src/user/user.model'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { AuthDto } from './dto/auth.dto'
import { AuthHelper } from './Helper'
import { Helper } from 'src/Helper'
import { JwtService } from '@nestjs/jwt'
import { RefreshTokenDto } from './dto/refresToken.dto'

@Injectable()
export class AuthService {
	constructor(
		@InjectModel(User.name) private UserModel: Model<User>,
		private readonly jwtService: JwtService,
	) {}

	async register(dto: AuthDto) {
		const getOldUser = await this.UserModel.findOne({ email: dto.email })
		if (getOldUser) return new BadRequestException('User already exist')
		const hashedUserPass = await AuthHelper.hashPassword(dto)
		const newUser = await this.UserModel.create(hashedUserPass)

		const tokens = this.issueTokenPair(newUser._id.toString())

		return {
			...Helper.removePasswordFromUser(newUser),
			...tokens,
		}
	}

	async auth(dto: AuthDto) {
		const searchUser = await this.UserModel.findOne({ email: dto.email })
		if (!searchUser) throw new BadRequestException('User not found')
		const comperePass = await AuthHelper.comparePassword(
			dto.password,
			searchUser.password,
		)
		if (!comperePass) throw new BadRequestException('User not found')

		const generateNewToken = this.issueTokenPair(searchUser._id.toString())

		return {
			...Helper.removePasswordFromUser(searchUser),
			...generateNewToken,
		}
	}
	issueTokenPair(userId: string) {
		const data = { _id: userId }
		const refreshToken = this.jwtService.sign(data, { expiresIn: '7d' })
		const accessToken = this.jwtService.sign(data, { expiresIn: '1h' })

		return {
			refreshToken,
			accessToken,
		}
	}

	async getNewTokens({ refreshToken }: RefreshTokenDto) {
 
		if (!refreshToken) throw new UnauthorizedException('Please sign in')

		const result = await this.jwtService.verifyAsync(refreshToken)

		if (!result) return new UnauthorizedException('Please sign in')

		const user = await this.UserModel.findById(result._id)
		const generateNewToken = this.issueTokenPair(user._id.toString())

		return {
			...Helper.removePasswordFromUser(user),
			...generateNewToken,
		}
	}
}
