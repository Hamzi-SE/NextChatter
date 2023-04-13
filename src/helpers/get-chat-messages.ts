import { messageArrayValidator, messageValidator } from '@/lib/validations/message'
import { notFound } from 'next/navigation'
import { fetchRedis } from './redis'

export async function getChatMessages(chatId: string) {
	try {
		const results: string[] = await fetchRedis('zrange', `chat:${chatId}:messages`, 0, -1) // get all messages from chat

		const dbMessages = results.map(message => JSON.parse(message) as Message) // parse stringified messages

		const reversedDbMessages = dbMessages.reverse() // reverse messages to show newest first

		const messages = messageArrayValidator.parse(reversedDbMessages) // validate messages

		return messages
	} catch (error) {
		console.log(error)
		notFound()
	}
}

export async function getLatestChatMessage(chatId: string) {
	try {
		const results: string[] = await fetchRedis('zrange', `chat:${chatId}:messages`, -1, -1) // get last message from chat

		const dbMessage = JSON.parse(results[0]) as Message // parse stringified message

		const message = messageValidator.parse(dbMessage) // validate message

		return message
	} catch (error) {
		console.log(error)
		notFound()
	}
}
