import { Model, Types } from 'mongoose'
import { User } from './user.model'
import { InjectModel } from '@nestjs/mongoose'
import {
	BadRequestException,
	Injectable,
	NotFoundException,
	BadGatewayException,
} from '@nestjs/common'
import { AuthHelper } from 'src/auth/Helper'

@Injectable()
export class UserService {
	constructor(
		@InjectModel(User.name) private readonly UserModel: Model<User>,
	) {}

	async byId(id: string) {
		const user = await this.UserModel.findById(id)

		if (!user) throw new NotFoundException('User not found')

		return user
	}

	async updateProfile(_id: string, dto: Partial<User>) {
		const getUserBydId = await this.byId(_id)
		const cloneDto = { ...dto }

		const isSameUser = await this.UserModel.findOne({ email: dto.email })

		if (isSameUser && isSameUser._id.toString() !== _id.toString())
			throw new BadRequestException('This mail is already  used')

		if (dto.password) {
			const newPassword = await AuthHelper.onlyHashPassword(dto.password)
			cloneDto.password = newPassword
		}

		await getUserBydId.updateOne(dto)

		return {
			success: true,
		}
	}

	async getAll(searchTerm?: string) {
		let options = {}

		if (searchTerm) {
			options = {
				$or: [
					{
						email: new RegExp(searchTerm, 'i'),
					},
				],
			}
		}
		const getAllUsers = await this.UserModel.find(options)
			.sort({ createdAt: 'desc' })
			.select('-password')

		return {
			users: getAllUsers,
			count: getAllUsers.length,
		}
	}

	async deleteUser(id: string) {
		const user = await this.UserModel.findByIdAndDelete(id)

		if (!user) throw new BadGatewayException('User Alrady Deleted')

		return {
			success: true,
		}
	}

	async toggleFavorite(user: User, movieId: Types.ObjectId) {
		const { _id, favorites } = user

		await this.UserModel.findByIdAndUpdate(_id, {
			favorites: favorites.includes(movieId)
				? favorites.filter((id) => String(id) !== String(movieId))
				: [...favorites, movieId],
		})
	}

	async getFavorites(userId: Types.ObjectId) {
		const data = await this.UserModel.findById(userId).populate({
			path: 'favorites',
			populate: {
				path: 'genres',
			},
		})

		return data.toObject().favorites
	}
}
