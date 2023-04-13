'use client'

import { getChatMessages, getLatestChatMessage } from '@/helpers/get-chat-messages'
import { db } from '@/lib/db'
import { chatHrefConstructor } from '@/lib/utils'
import Image from 'next/image'
import { notFound, usePathname, useRouter } from 'next/navigation'
import { FC, useEffect, useState } from 'react'

interface SidebarChatListProps {
	friends: User[]
	sessionId: string
}

const SidebarChatList: FC<SidebarChatListProps> = ({ friends, sessionId }) => {
	const [unseenMessages, setUnseenMessages] = useState<Message[]>([])
	// const [lastMessages, setLastMessages] = useState<Message[]>([]) -- TODO

	const router = useRouter()
	const pathname = usePathname()

	useEffect(() => {
		if (pathname?.includes('chat')) {
			setUnseenMessages(prev => {
				return prev.filter(message => !pathname?.includes(message.senderId))
			})
		}
	}, [pathname])

	return (
		<ul role='list' className='max-h-[25rem] overflow-y-auto -mx-2 space-y-1'>
			{friends.sort().map(friend => {
				const unseenMessagesCount = unseenMessages.filter(unseenMessage => unseenMessage.senderId === friend.id).length
				return (
					<li key={`friend-${friend.id}`}>
						<a
							href={`/dashboard/chat/${chatHrefConstructor(sessionId, friend.id)}`}
							className='text-gray-700 hover:text-indigo-600 hover:bg-gray-50 group flex items-center gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold'>
							<Image src={friend.image} width={30} height={30} className='rounded-full' alt={friend.name} />
							{friend.name}
							{unseenMessagesCount > 0 && (
								<div className='bg-indigo-600 text-xs font-medium text-white w-4 h-4 rounded-full flex justify-center items-center'>
									{unseenMessagesCount}
								</div>
							)}
						</a>
					</li>
				)
			})}
		</ul>
	)
}

export default SidebarChatList
