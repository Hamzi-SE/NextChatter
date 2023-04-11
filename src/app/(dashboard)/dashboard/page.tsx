import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';

const page = async ({}) => {
	const session = await getServerSession(authOptions);

	return (
		<main className='pt-8'>
			<h1 className='font-bold text-5xl mb-8'>Dashboard</h1>
		</main>
	);
};

export default page;
