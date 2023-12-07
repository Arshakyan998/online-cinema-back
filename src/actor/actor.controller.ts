import {
	Controller,
	Post,
	Body,
	Get,
	Param,
	Delete,
	UsePipes,
	ValidationPipe,
	HttpCode,
	Query,
} from '@nestjs/common'
import { ActorService } from './actor.service'
import { Auth } from 'src/auth/decorators/auth.decorator'
import { User } from 'src/user/decorators/user.decorator'
import { ActorDto } from './actor.dto'
import { idValidationPipe } from 'src/pipes/id.validation.pipe'

@Controller('actor')
export class ActorController {
	constructor(private readonly actorService: ActorService) {}
	@Get()
	@HttpCode(200)
	getAll(@Query('search') searchParam?: string) {
		return this.actorService.getAll(searchParam)
	}

	@Post('update')
	@HttpCode(201)
	@Auth('admin')
	update(@User('_id') id: string, @Body() dto: ActorDto) {
		return this.actorService.update(id, dto)
	}

	@Delete(':id')
	@UsePipes(new ValidationPipe())
	@Auth('admin')
	delete(@Param('id', idValidationPipe) id: string) {
		return this.actorService.delete(id)
	}

	@Post('create')
	@Auth('admin')
	create(@Body() data: ActorDto) {
		return this.actorService.create(data)
	}

	@Get('by-slug/:slug')
	getBySlug(@Param('slug') slug: string) {
		return this.actorService.getBySlug(slug)
	}
}
