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
	Put,
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
	getAll(@Query('searchTerm') searchParam?: string) {
		return this.actorService.getAll(searchParam)
	}

	@Put(':id')
	@HttpCode(201)
	@Auth('admin')
	update(@Param('id') id: string, @Body() dto: ActorDto) {
		return this.actorService.update(id, dto)
	}

	@Get(':id')
	@HttpCode(201)
	@Auth('admin')
	getById(@Param('id') id: string) {
		return this.actorService.getActorById(id)
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
