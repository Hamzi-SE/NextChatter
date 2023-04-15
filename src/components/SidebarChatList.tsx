'use client'

import { pusherClient } from '@/lib/pusher'
import { chatHrefConstructor, toPusherKey } from '@/lib/utils'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { FC, useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import UnseenChatToast from './UnseenChatToast'

interface SidebarChatListProps {
	friends: User[]
	sessionId: string
}

interface ExtendedMessage extends Message {
	senderName: string
	senderImage: string
}

const SidebarChatList: FC<SidebarChatListProps> = ({ friends, sessionId }) => {
	const [unseenMessages, setUnseenMessages] = useState<Message[]>([])
	// const [lastMessages, setLastMessages] = useState<Message[]>([]) -- TODO
	const [activeChats, setActiveChats] = useState<User[]>(friends)

	const router = useRouter()
	const pathname = usePathname()

	useEffect(() => {
		pusherClient.subscribe(toPusherKey(`user:${sessionId}:chats`))
		pusherClient.subscribe(toPusherKey(`user:${sessionId}:friends`))

		const newFriendHandler = (newFriend: User) => {
			setActiveChats(prev => [...prev, newFriend])
		}

		const chatHandler = (message: ExtendedMessage) => {
			const shouldNotify = pathname !== `/dashboard/chat/${chatHrefConstructor(sessionId, message.senderId)}`

			if (!shouldNotify) return

			// should be notified
			toast.custom(toast => (
				<UnseenChatToast
					toast={toast}
					sessionId={sessionId}
					senderId={message.senderId}
					senderImage={message.senderImage}
					senderName={message.senderName}
					senderMessage={message.text}
				/>
			))

			setUnseenMessages(prev => [...prev, message])
		}

		pusherClient.bind('new_message', chatHandler)
		pusherClient.bind('new_friend', newFriendHandler)

		return () => {
			pusherClient.unsubscribe(toPusherKey(`user:${sessionId}:chats`))
			pusherClient.unsubscribe(toPusherKey(`user:${sessionId}:friends`))

			pusherClient.unbind('new_message', chatHandler)
			pusherClient.unbind('new_friend', newFriendHandler)
		}
	}, [sessionId, pathname, router])

	useEffect(() => {
		if (pathname?.includes('chat')) {
			setUnseenMessages(prev => {
				return prev.filter(message => !pathname?.includes(message.senderId))
			})
		}
	}, [pathname])

	return (
		<ul role='list' className='max-h-[25rem] overflow-y-auto -mx-2 space-y-1'>
			{activeChats.sort().map(friend => {
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
