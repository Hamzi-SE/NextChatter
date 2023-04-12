import Button from '@/components/ui/Button';
import Image from 'next/image';
import Link from 'next/link';

export default async function Home() {
	return (
		<>
			<div className='flex flex-col items-center justify-center min-h-screen'>
				<Image src='/cool-background.svg' alt='bg-image' fill style={{ objectFit: 'cover', zIndex: '-1' }} />
				<div className='container mt-44 text-center flex-grow'>
					<h1 className='text-6xl font-bold mb-5'>NextChatter</h1>

					<p className='text-black text-xl font-semibold mb-5'>A simple real-time chat app built using Next.js 13, Typescript and Upstash.</p>

					<Link href='/login'>
						<Button size='xl' className='text-base'>
							Login
						</Button>
					</Link>
				</div>

				<footer className='text-center text-sm py-2 w-full'>
					<p>
						Made with <span className='text-red-500'>❤</span> by{' '}
						<a href='https://twitter.com/Hamzii_SE' target='_blank' rel='noreferrer'>
							<strong>Hamza</strong>
						</a>
						{' | '}
						<a href='https://github.com/Hamzi-SE/NextChatter' target='_blank' rel='noreferrer'>
							<strong>Source Code</strong>
						</a>
					</p>

					<p>
						&copy; 2023 by{' '}
						<a href='https://hamzii.me' target='_blank' rel='noreferrer'>
							<strong>Hamzii.me</strong>{' '}
						</a>
						All rights reserved.
					</p>
				</footer>
			</div>
		</>
	);
}
