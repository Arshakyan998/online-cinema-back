import { ExecutionContext, createParamDecorator } from '@nestjs/common'
import { User as UserModel } from '../user.model'

type TypeData = keyof UserModel

export const User = createParamDecorator(
	(data: TypeData, context: ExecutionContext) => {
		const getUser = context.switchToHttp().getRequest().user
		return data ? getUser[data] : getUser
	},
)
