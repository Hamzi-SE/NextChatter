import ChatInput from '@/components/ChatInput'
import Messages from '@/components/Messages'
import { getChatMessages } from '@/helpers/get-chat-messages'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { getServerSession } from 'next-auth'
import Image from 'next/image'
import { notFound } from 'next/navigation'

interface PageProps {
	params: {
		chatId: string
	}
}

const page = async ({ params }: PageProps) => {
	const { chatId } = params

	const session = await getServerSession(authOptions)

	if (!session) notFound()

	const { user } = session

	const [userId1, userId2] = chatId.split('--') as [string, string]

	if (userId1 !== user.id && userId2 !== user.id) notFound()

	const chatPartnerId = userId1 === user.id ? userId2 : userId1

	const chatPartner = (await db.get(`user:${chatPartnerId}`)) as User

	if (!chatPartner) notFound()

	const initialMessages = await getChatMessages(chatId)

	return (
		<div className='flex-1 justify-between flex flex-col h-full max-h-[calc(100vh-6rem)]'>
			<div className='flex sm:items-center justify-between py-3 border-b-2 border-gray-200'>
				<div className='relative flex items-center space-x-4'>
					<div className='relative'>
						<div className='relative w-8 h-8 sm:w-12 sm:h-12'>
							<Image fill referrerPolicy='no-referrer' src={chatPartner.image} alt={`${chatPartner.name} profile picture`} className='rounded-full' />
						</div>
					</div>

					<div className='flex flex-col leading-tight'>
						<div className='text-xl flex items-center'>
							<span className='text-gray-700 mr-3 font-semibold'>{chatPartner.name}</span>
						</div>

						<span className='text-sm text-gray-600'>{chatPartner.email}</span>
					</div>
				</div>
			</div>

			<Messages initialMessages={initialMessages} sessionId={session.user.id} sessionImage={session.user.image} chatPartner={chatPartner} />

			<ChatInput chatPartner={chatPartner} chatId={chatId} />
		</div>
	)
}

export default page
