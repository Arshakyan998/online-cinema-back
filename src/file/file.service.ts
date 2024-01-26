import {
	BadRequestException,
	Injectable,
	NotFoundException,
} from '@nestjs/common'
import { IFile } from './file.interface'
import { ensureDir, outputFile, pathExists, remove } from 'fs-extra'
@Injectable()
export class FileService {
	async saveFile(
		file: Express.Multer.File[],
		path: string,
		fileName: string = 'default',
	): Promise<IFile[]> {
		const dir = `${path}/${fileName}`

		const isDirExist = await pathExists(dir)

		if (!isDirExist) {
			await ensureDir(dir)
		}

		const result: IFile[] = await Promise.all(
			file.map(async (file) => {
				try {
					const fileType = file.mimetype.includes('mp4')

					console.log(fileType)

					const filePath = `${dir}/${file.originalname}`

					const isFileExist = await pathExists(filePath)

					if (isFileExist) throw new BadRequestException('File already exist')

					await outputFile(`${dir}/${file.originalname}`, file.buffer)

					return {
						name: file.originalname,
						url: `uploads/${fileName}/${file.originalname}`,
					}
				} catch (error) {
					throw new BadRequestException(error.message)
				}
			}),
		)

		return result
	}

	deleteFile(path: string) {
		if (pathExists(path)) {
			console.log('qweqweqwe')
			remove(path, (err) => {
				if (err) throw new NotFoundException(err)
				return {
					success: true,
					message: 'file been removed',
				}
			})
		} else {
			throw new NotFoundException('file not found')
		}
	}
}
