'use client'

import { cn } from '@/lib/utils'
import { Message } from '@/lib/validations/message'
import Image from 'next/image'
import { FC, useRef, useState } from 'react'

interface MessagesProps {
	initialMessages: Message[]
	sessionId: string
	sessionImage: string | null | undefined
	chatPartner: User
}

const Messages: FC<MessagesProps> = ({ initialMessages, sessionId, sessionImage, chatPartner }) => {
	const [messages, setMessages] = useState<Message[]>(initialMessages)

	const scrollDownRef = useRef<HTMLDivElement | null>(null)

	return (
		<div
			id='messages'
			className='flex h-full flex-1 flex-col-reverse gap-4 p-3 overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch'>
			<div ref={scrollDownRef} />

			{messages.map((message, index) => {
				const isCurrentUser = message.senderId === sessionId

				const hasNextMessageFromSameUser = messages[index - 1]?.senderId === messages[index].senderId

				return (
					<div key={`message-${message.id}-${message.timestamp}`} className={`chat-message`}>
						<div className={cn('flex items-end', { 'justify-end': isCurrentUser })}>
							<div
								className={cn('flex flex-col space-y-2 text-base max-w-xs mx-2', {
									'order-1 items-end': isCurrentUser,
									'order-2 items-start': !isCurrentUser,
								})}>
								<span
									className={cn('px-4 py-2 rounded-lg inline-block', {
										'bg-indigo-600 text-white': isCurrentUser,
										'bg-gray-200 text-gray-900': !isCurrentUser,
										'rounded-br-none': isCurrentUser && !hasNextMessageFromSameUser,
										'rounded-bl-none': !isCurrentUser && !hasNextMessageFromSameUser,
									})}>
									{message.text}{' '}
									<span className='ml-2 text-xs text-gray-400'>
										{new Date(message.timestamp).toLocaleTimeString()} - {new Date(message.timestamp).toLocaleDateString()}
									</span>
								</span>
							</div>

							<div
								className={cn('relative w-6 h-6', {
									'order-2': isCurrentUser,
									'order-1': !isCurrentUser,
									invisible: hasNextMessageFromSameUser,
								})}>
								<Image
									fill
									src={isCurrentUser ? (sessionImage as string) : chatPartner.image}
									alt={`${isCurrentUser ? 'Your' : chatPartner.name} profile picture`}
									className='rounded-full'
									referrerPolicy='no-referrer'
								/>
							</div>
						</div>
					</div>
				)
			})}
		</div>
	)
}

export default Messages
