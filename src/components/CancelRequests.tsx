'use client'

import axios from 'axios'
import { Check, UserPlus, X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { FC, useState } from 'react'

interface FriendRequestsProps {
	sessionId: string
	outgoingFriendRequests: OutgoingFriendRequest[]
}

const CancelRequests: FC<FriendRequestsProps> = ({ sessionId, outgoingFriendRequests }) => {
	const [sentRequests, setSentRequests] = useState<OutgoingFriendRequest[]>(outgoingFriendRequests)

	const router = useRouter()

	const cancelRequest = async (receiverId: string) => {
		await axios.post('/api/friends/cancel', { id: receiverId })

		setSentRequests(prev => prev.filter(request => request.receiverId !== receiverId))

		router.refresh()
	}

	return (
		<>
			{sentRequests.length === 0 ? (
				<p className='text-zinc-500 text-sm'>You have not sent any friend requests.</p>
			) : (
				sentRequests.map(request => (
					<div key={`request-${request.receiverId}`} className='flex gap-4 items-center'>
						<UserPlus className='text-black' />

						<p className='font-medium text-lg'>{request.receiverEmail}</p>

						<button
							onClick={() => cancelRequest(request.receiverId)}
							aria-label='cancel friend request'
							className='w-8 h-8 bg-red-600 hover:bg-red-700 grid place-items-center rounded-full transition hover:shadow-md'>
							<X className='font-semibold text-white w-3/4 h-3/4' />
						</button>
					</div>
				))
			)}
		</>
	)
}

export default CancelRequests
