import { User } from './user/user.model'

export class Helper {
	static removePasswordFromUser<T extends User>(
		user: T,
		key: keyof T = 'password',
	) {
		const userToObject = user.toJSON()
		delete userToObject[key]

		return userToObject
	}
}
