'use client'

import { Users } from 'lucide-react'
import Link from 'next/link'
import { FC, useState } from 'react'

interface SentRequestsSidebarOptionProps {
	sessionId: string
	initialSentRequestCount: number
}

const SentRequestsSidebarOption: FC<SentRequestsSidebarOptionProps> = ({ sessionId, initialSentRequestCount }) => {
	const [unseenSentRequestCount, setUnseenSentRequestCount] = useState<number>(initialSentRequestCount)

	return (
		<Link
			href='/dashboard/sent'
			className='text-gray-700 hover:text-indigo-600 hover:bg-gray-50 group flex items-center gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold'>
			<div className='text-gray-400 border-gray-200 group-hover:border-indigo-600 group-hover:text-indigo-600 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border text-[0.625rem] font-medium bg-white'>
				<Users className='h-4 w-4' />
			</div>
			<p className='truncate'>Sent Requests</p>

			{unseenSentRequestCount > 0 && (
				<span className='inline-flex items-center justify-center px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800'>
					{unseenSentRequestCount}
				</span>
			)}
		</Link>
	)
}

export default SentRequestsSidebarOption
