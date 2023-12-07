import { ConfigService } from '@nestjs/config'

export const getMongoDbConfig = async (configService: ConfigService) => ({
	uri: configService.get<string>('MONGO_URI'),
	family: 4,
})
