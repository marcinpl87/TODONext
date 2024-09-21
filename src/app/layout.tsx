import type { Metadata } from 'next';
import { ThemeProvider } from 'next-themes';
import LoadingPage from '../components/LoadingPage';
import { cn, fontSans } from '../utils';
import { LoginProvider } from '../hooks';
import '../globals.scss';

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
		<html lang="en" suppressHydrationWarning>
			<head />
			<body
				className={cn(
					'min-h-screen bg-background font-sans antialiased',
					fontSans.variable,
				)}
			>
				<ThemeProvider
					attribute="class"
					defaultTheme="system"
					enableSystem
				>
					<main className="flex min-h-screen flex-col items-center">
						<LoadingPage />
						<LoginProvider>{children}</LoginProvider>
					</main>
				</ThemeProvider>
			</body>
		</html>
	);
}
