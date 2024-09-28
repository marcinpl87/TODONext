import Link from 'next/link';
import { Github, LogOut } from 'lucide-react';
import { siteConfig } from '../config';
import { useDispatchLogin, useLogin } from '../hooks';
import { Button, buttonVariants } from './ui/button';
import MainNav from './MainNav';
import ThemeToggle from './ThemeToggle';
import MyAvatar from './MyAvatar';
import { LOGIN_ACTIONS } from '../types';

const SiteHeader: React.FC = () => {
	const login = useLogin();
	const dispatchLogin = useDispatchLogin();

	return (
		<header className="bg-background sticky top-0 z-40 w-full border-b">
			<div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
				<MainNav items={siteConfig.mainNav} />
				<div className="flex flex-1 items-center justify-end space-x-4">
					<nav className="flex items-center space-x-1">
						<Link
							href={siteConfig.links.github}
							target="_blank"
							rel="noreferrer"
						>
							<div
								className={buttonVariants({
									size: 'icon',
									variant: 'ghost',
								})}
							>
								<Github className="h-5 w-5" />
								<span className="sr-only">GitHub</span>
							</div>
						</Link>
						<ThemeToggle />
						<Button
							variant="ghost"
							size="icon"
							onClick={() =>
								dispatchLogin({
									action: LOGIN_ACTIONS.LOGOUT,
									userId: '',
									userName: '',
								})
							}
							title={`Logout ${login.userName} (${login.userId})`}
						>
							<LogOut className="size-5" />
							<span className="sr-only">Log out</span>
						</Button>
						<MyAvatar name={login.userName} />
					</nav>
				</div>
			</div>
		</header>
	);
};

export default SiteHeader;
