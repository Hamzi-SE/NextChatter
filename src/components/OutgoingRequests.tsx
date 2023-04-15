'use client'

import axios from 'axios'
import { UserPlus, X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { FC, useState } from 'react'

interface OutgoingRequestsProps {
	sessionId: string
	OutgoingRequests: IncomingFriendRequest[]
}

const OutgoingRequests: FC<OutgoingRequestsProps> = ({ sessionId, OutgoingRequests }) => {
	const [sentRequests, setSentRequests] = useState<IncomingFriendRequest[]>(OutgoingRequests)

	const router = useRouter()

	const cancelRequest = async (cancelId: string) => {
		await axios.post('/api/friends/cancel', { id: cancelId })

		setSentRequests(prev => prev.filter(request => request.senderId !== cancelId))

		router.refresh()
	}

	return (
		<>
			{sentRequests.length === 0 ? (
				<p className='text-zinc-500 text-sm'>You have not sent any friend requests.</p>
			) : (
				sentRequests.map(request => (
					<div key={`request-${request.senderId}`} className='flex gap-4 items-center'>
						<UserPlus className='text-black' />

						<p className='font-medium text-lg'>{request.senderEmail}</p>

						<button
							onClick={() => cancelRequest(request.senderId)}
							aria-label='reject friend'
							className='w-8 h-8 bg-red-600 hover:bg-red-700 grid place-items-center rounded-full transition hover:shadow-md'>
							<X className='font-semibold text-white w-3/4 h-3/4' />
						</button>
					</div>
				))
			)}
		</>
	)
}

export default OutgoingRequests
