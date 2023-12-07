import {
	ExecutionContext,
	ForbiddenException,
	CanActivate,
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'

export class BossGuard implements CanActivate {
	constructor(private readonly Reflector: Reflector) {}

	canActivate(context: ExecutionContext): boolean {
		const roles = context.switchToHttp().getRequest().user

		if (!roles.BOSS) throw new ForbiddenException('Only for BOSS')

		return true
	}
}
