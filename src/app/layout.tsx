import Providers from '@/components/Providers';
import './globals.css';

export const metadata = {
	title: 'NextChatter',
	description: 'A simple real-time chat app built using Typescript, Next.js 13 and Upstash',
	creator: 'Muhammad Hamza',
	viewport: 'width=device-width, initial-scale=1',
	openGraph: {
		type: 'website',
		locale: 'en_US',
		url: 'https://nextchatter.vercel.app/',
		title: 'NextChatter',
		description: 'A simple real-time chat app built using Typescript, Next.js 13 and Upstash',
		siteName: 'NextChatter',
		countryName: 'Pakistan',
	},
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang='en'>
			<body>
				<Providers>{children}</Providers>
			</body>
		</html>
	);
}
