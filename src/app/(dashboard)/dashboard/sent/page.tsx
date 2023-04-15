import CancelRequests from '@/components/CancelRequests'
import { fetchRedis } from '@/helpers/redis'
import { authOptions } from '@/lib/auth'
import { getServerSession } from 'next-auth'
import { notFound } from 'next/navigation'

const page = async () => {
	const session = await getServerSession(authOptions)
	if (!session) notFound()

	// IDs of users who this user have sent a friend request to
	const outgoingReceiverIds = (await fetchRedis('smembers', `user:${session.user.id}:outgoing_friend_requests`)) as string[]

	const outgoingFriendRequests = await Promise.all(
		outgoingReceiverIds.map(async receiverId => {
			const receiver = (await fetchRedis('get', `user:${receiverId}`)) as string
			const receiverParsed = JSON.parse(receiver) as User
			return {
				receiverId,
				receiverEmail: receiverParsed.email,
			}
		})
	)

	return (
		<main className='pt-8'>
			<h1 className='font-bold text-5xl mb-8'>Sent Requests</h1>
			<div className='flex flex-col gap-4'>
				<CancelRequests outgoingFriendRequests={outgoingFriendRequests} sessionId={session.user.id} />
			</div>
		</main>
	)
}

export default page
