import * as bcrypt from 'bcrypt'
export class AuthHelper {
	static async onlyHashPassword(pass: string) {
		const passwordHash = await bcrypt.hash(pass, 10)
		return passwordHash
	}

	static async hashPassword<T extends { password: string }>(dto: T) {
		const passwordHash = await bcrypt.hash(dto.password, 10)
		return {
			...dto,
			password: passwordHash,
		}
	}

	static async comparePassword(password: string, passwordHash: string) {
		return await bcrypt.compare(password, passwordHash)
	}
}
