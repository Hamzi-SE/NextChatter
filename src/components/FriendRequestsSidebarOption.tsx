'use client'

import { pusherClient } from '@/lib/pusher'
import { toPusherKey } from '@/lib/utils'
import { User } from 'lucide-react'
import Link from 'next/link'
import { FC, useEffect, useState } from 'react'

interface FriendRequestsSidebarOptionProps {
	sessionId: string
	initialUnseenRequestCount: number
}

const FriendRequestsSidebarOption: FC<FriendRequestsSidebarOptionProps> = ({ sessionId, initialUnseenRequestCount }) => {
	const [unseenRequestCount, setUnseenRequestCount] = useState<number>(initialUnseenRequestCount)

	useEffect(() => {
		pusherClient.subscribe(toPusherKey(`user:${sessionId}:incoming_friend_requests`))
		pusherClient.subscribe(toPusherKey(`user:${sessionId}:friends`))

		const friendRequestHandler = () => {
			setUnseenRequestCount(prev => prev + 1)
		}

		const addedFriendHandler = () => {
			setUnseenRequestCount(prev => prev - 1)
		}

		pusherClient.bind('incoming_friend_requests', friendRequestHandler)
		pusherClient.bind('new_friend', addedFriendHandler)

		return () => {
			pusherClient.unsubscribe(toPusherKey(`user:${sessionId}:incoming_friend_requests`))
			pusherClient.unbind('incoming_friend_requests', friendRequestHandler)

			pusherClient.unsubscribe(toPusherKey(`user:${sessionId}:friends`))
			pusherClient.unbind('new_friend', addedFriendHandler)
		}
	}, [sessionId])

	return (
		<Link
			href='/dashboard/requests'
			className='text-gray-700 hover:text-indigo-600 hover:bg-gray-50 group flex items-center gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold'>
			<div className='text-gray-400 border-gray-200 group-hover:border-indigo-600 group-hover:text-indigo-600 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border text-[0.625rem] font-medium bg-white'>
				<User className='h-4 w-4' />
			</div>
			<p className='truncate'>Friend requests</p>

			{unseenRequestCount > 0 && (
				<span className='inline-flex items-center justify-center px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-600 text-white'>
					{unseenRequestCount}
				</span>
			)}
		</Link>
	)
}

export default FriendRequestsSidebarOption
