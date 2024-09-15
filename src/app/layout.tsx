import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import LoadingPage from '../components/LoadingPage';
import { LoginProvider } from '../hooks';
import '../globals.scss';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
	title: 'TODO Next App',
	description:
		'A simple TODO app to organize tasks and projects by allowing users to create, manage, and prioritize their projects and individual todos efficiently.',
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body className={inter.className}>
				<main className="flex min-h-screen flex-col items-center">
					<LoadingPage />
					<LoginProvider>{children}</LoginProvider>
				</main>
			</body>
		</html>
	);
}
