import { fetchRedis } from '@/helpers/redis'
import { authOptions } from '@/lib/auth'
import { getServerSession } from 'next-auth'
import { notFound } from 'next/navigation'
import { FC } from 'react'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

const loading = async () => {
	const session = await getServerSession(authOptions)
	if (!session) notFound()

	const incomingRequestCount = ((await fetchRedis('smembers', `user:${session.user.id}:incoming_friend_requests`)) as User[]).length

	return (
		<div className='w-full flex flex-col gap-3'>
			<Skeleton height={60} width={500} className='mb-4' />
			{incomingRequestCount === 0 && <Skeleton height={25} width={200} className='mb-4' />}

			{/* show skeletons depending on the number of requests */}
			{[...Array(incomingRequestCount)].map((_, i) => (
				<div key={i} className='flex flex-col gap-2'>
					<Skeleton height={30} width={350} />
				</div>
			))}
		</div>
	)
}

export default loading
