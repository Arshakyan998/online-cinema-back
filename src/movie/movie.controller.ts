import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	Param,
	Post,
	UsePipes,
	ValidationPipe,
	Put,
} from '@nestjs/common'
import { MovieService } from './movie.service'
import { idValidationPipe } from 'src/pipes/id.validation.pipe'
import { Auth } from 'src/auth/decorators/auth.decorator'
import { CreateMovieDto } from './create-movie.dto'
import { Types } from 'mongoose'
import { SlagDto } from './slag.dto'

@Controller('movie')
export class MovieController {
	constructor(private readonly movieService: MovieService) {}
	@Get()
	@HttpCode(200)
	getAll(@Body('search') searchParam?: string) {
		return this.movieService.getAll(searchParam)
	}

	@Put('update/:id')
	@HttpCode(201)
	@UsePipes(
		new ValidationPipe({
			always: true,
			errorHttpStatusCode: 400,
		}),
	)
	@Auth('admin')
	update(
		@Param('id', idValidationPipe) id: string,
		@Body() dto: Partial<CreateMovieDto>,
	) {
		return this.movieService.update(id, dto)
	}

	@Put('update-count-opened')
	@HttpCode(200)
	@UsePipes(new ValidationPipe())
	updateCountOpened(@Body() { slag }: SlagDto) {
		return this.movieService.updateCountOpened(slag)
	}

	@Delete(':id')
	@UsePipes(new ValidationPipe())
	@Auth('admin')
	delete(@Param('id', idValidationPipe) id: string) {
		return this.movieService.delete(id)
	}

	@Post('create')
	@Auth('admin')
	create(@Body() data: CreateMovieDto) {
		return this.movieService.create(data)
	}

	@Get('by-slug/:slug')
	getBySlug(@Param('slug') slug: string) {
		return this.movieService.getBySlug(slug)
	}

	@Get('actor/:actorsId')
	@UsePipes(new ValidationPipe())
	getByActor(@Param('actorsId', idValidationPipe) actorsId: string) {
		return this.movieService.getByActor(actorsId)
	}

	@Post('by-genres')
	getByGenres(@Body('ids') genreId: Types.ObjectId[]) {
		return this.movieService.getByGenres(genreId)
	}

	@Get('most-popular')
	getMostPopularFilms() {
		return this.movieService.getMostPopular()
	}
}
