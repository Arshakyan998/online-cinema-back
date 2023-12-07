import { applyDecorators, UseGuards } from '@nestjs/common'
import { TypeRole } from '../auth.interface'
import { JwtAuthGuard } from 'src/guards/jwt.guard'
import { OnlyAdminGuard } from 'src/guards/admin.guard'
import { BossGuard } from 'src/guards/boss.guard'

export const Auth = (role: TypeRole = 'user') =>
	applyDecorators(
		(() => {
			switch (role) {
				case 'admin':
					return UseGuards(JwtAuthGuard, OnlyAdminGuard)
				case 'BOSS':
					return UseGuards(JwtAuthGuard, OnlyAdminGuard, BossGuard)
				default:
					return UseGuards(JwtAuthGuard)
			}
		})(),
	)
