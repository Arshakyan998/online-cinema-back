import { Injectable } from '@nestjs/common'
import { Telegraf } from 'telegraf'
import { Telegram } from './telegram.interface'
import { getTelegramConfig } from 'src/config/telegram.config'
import { ExtraReplyMessage } from 'telegraf/typings/telegram-types'
@Injectable()
export class TelegramService {
	bot: Telegraf
	options: Telegram

	constructor() {
		this.options = getTelegramConfig()
		this.bot = new Telegraf(this.options.token)
	}

	async sendMessage(
		msg: string,
		options?: ExtraReplyMessage,
		chatId = this.options.chatId,
	) {
		await this.bot.telegram.sendMessage(chatId, msg, {
			...options,
			parse_mode: 'HTML',
		})
	}

	async sendPhoto(photo: string, msg?: string, chatId = this.options.chatId) {
		await this.bot.telegram.sendPhoto(chatId, photo, {
			caption: msg,
		})
	}
}
