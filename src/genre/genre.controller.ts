import {
	Controller,
	Param,
	Get,
	HttpCode,
	Body,
	Post,
	Delete,
	ValidationPipe,
	UsePipes,
} from '@nestjs/common'
import { GenreService } from './genre.service'
import { Auth } from 'src/auth/decorators/auth.decorator'
import { CreateGenreDto } from './dto/create-genre.dto'
import { User } from 'src/user/decorators/user.decorator'
import { idValidationPipe } from 'src/pipes/id.validation.pipe'

@Controller('genre')
export class GenreController {
	constructor(private readonly genreService: GenreService) {}

	@Post()
	@HttpCode(200)
	getAll(@Body('search') searchParam?: string) {
		return this.genreService.getAll(searchParam)
	}

	@Post('update')
	@HttpCode(201)
	@Auth('admin')
	update(@User('_id') id: string, @Body() dto: CreateGenreDto) {
		return this.genreService.update(id, dto)
	}

	@Delete(':id')
	@UsePipes(new ValidationPipe())
	@Auth('admin')
	delete(@Param('id', idValidationPipe) id: string) {
		return this.genreService.delete(id)
	}

	@Post('create')
	@Auth('admin')
	create(@Body() data: CreateGenreDto) {
		return this.genreService.create(data)
	}

	@Get('by-slug/:slug')
	getBySlug(@Param('slug') slug: string) {
		return this.genreService.getBySlug(slug)
	}
}
