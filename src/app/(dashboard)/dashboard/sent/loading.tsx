import { fetchRedis } from '@/helpers/redis'
import { authOptions } from '@/lib/auth'
import { getServerSession } from 'next-auth'
import { notFound } from 'next/navigation'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

const loading = async () => {
	const session = await getServerSession(authOptions)
	if (!session) notFound()

	const outgoingRequestCount = ((await fetchRedis('smembers', `user:${session.user.id}:outgoing_friend_requests`)) as User[]).length

	return (
		<div className='w-full flex flex-col gap-3'>
			<Skeleton height={60} width={500} className='mb-4' />
			{outgoingRequestCount === 0 && <Skeleton height={25} width={300} className='mb-4' />}

			{/* show skeletons depending on the number of requests */}
			{[...Array(outgoingRequestCount)].map((_, i) => (
				<div key={i} className='flex flex-col gap-2'>
					<Skeleton height={30} width={350} />
				</div>
			))}
		</div>
	)
}

export default loading
