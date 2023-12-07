import {
	Controller,
	Post,
	UseInterceptors,
	UploadedFile,
	Query,
} from '@nestjs/common'
import { FileService } from './file.service'
import { FileInterceptor } from '@nestjs/platform-express'
import { path } from 'app-root-path'
import { Auth } from 'src/auth/decorators/auth.decorator'
@Controller('file')
export class FileController {
	constructor(private readonly fileService: FileService) {}

	@Post()
	@UseInterceptors(FileInterceptor('file'))
	@Auth('admin')
	uploadFile(
		@UploadedFile() file: Express.Multer.File,
		@Query('folder') folder?: string,
	) {
		console.log('folder')

		const rootPath = `${path}/uploads`

		return this.fileService.saveFile([file], rootPath, folder)
	}
}
