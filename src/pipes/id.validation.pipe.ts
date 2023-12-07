import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common'
import { Types } from 'mongoose'

@Injectable()
export class idValidationPipe implements PipeTransform {
	transform(value: string, metadata: ArgumentMetadata) {
		if (metadata.type !== 'param') return value
		if (!Types.ObjectId.isValid(value)) throw new Error('Id is not valid')

		return value
	}
}
