import { fetchRedis } from '@/helpers/redis'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { Message, messageValidator } from '@/lib/validations/message'
import { nanoid } from 'nanoid'
import { getServerSession } from 'next-auth'
import { z } from 'zod'

export async function POST(req: Request, res: Response) {
	try {
		const { text, chatId }: { text: string; chatId: string } = await req.json()
		const session = await getServerSession(authOptions)

		if (!session) return new Response('You must login to send a message', { status: 401 })

		const [userId1, userId2] = chatId.split('--')

		if (session.user.id !== userId1 && session.user.id !== userId2) {
			return new Response('You are not authorized to send a message to this chat', { status: 401 })
		}

		const friendId = session.user.id === userId1 ? userId2 : userId1

		const friendList = (await fetchRedis('sismember', `user:${session.user.id}:friends`, friendId)) as boolean

		if (!friendList) {
			return new Response('You are not friends with this user', { status: 401 })
		}

		const rawSender = (await fetchRedis('get', `user:${session.user.id}`)) as string
		const sender = JSON.parse(rawSender) as User

		const timestamp = Date.now()

		const messageData: Message = {
			id: nanoid(),
			senderId: session.user.id,
			receiverId: friendId,
			timestamp,
			text,
		}

		const message = messageValidator.parse(messageData)

		// sorted set
		await db.zadd(`chat:${chatId}:messages`, {
			score: timestamp, // score = key
			member: JSON.stringify(message), // member = value
		})

		return new Response('Message sent', { status: 200 })
	} catch (error) {
		if (error instanceof z.ZodError) {
			return new Response(error.message, { status: 400 })
		}

		if (error instanceof Error) {
			return new Response(error.message, { status: 500 })
		}

		return new Response('Something went wrong', { status: 500 })
	}
}
