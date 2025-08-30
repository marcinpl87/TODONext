'use client';

import React from 'react';
import { Link } from 'next-view-transitions';
import { Github, LogOut } from 'lucide-react';
import { siteConfig } from '../config';
import { useDispatchLogin, useLogin } from '../hooks';
import { Button } from './ui/button';
import ThemeToggle from './ThemeToggle';
import MyAvatar from './MyAvatar';
import { LOGIN_ACTIONS } from '../types';

const SiteHeaderIcons: React.FC = () => {
	const login = useLogin();
	const dispatchLogin = useDispatchLogin();

	return (
		<nav className="flex items-center space-x-1">
			<Link
				href={siteConfig.links.github}
				target="_blank"
				rel="noreferrer"
			>
				<Button size="icon" variant="ghost">
					<Github className="h-5 w-5" />
					<span className="sr-only">GitHub</span>
				</Button>
			</Link>
			<ThemeToggle />
			<Button
				variant="ghost"
				size="icon"
				onClick={() => {
					localStorage.removeItem('authToken');
					dispatchLogin({
						action: LOGIN_ACTIONS.LOGOUT,
						userId: '',
						userName: '',
						users: [],
					});
				}}
				title={`Logout ${login.userName} (${login.userId})`}
			>
				<LogOut className="size-5" />
				<span className="sr-only">Log out</span>
			</Button>
			<MyAvatar name={login.userName} />
		</nav>
	);
};

export default SiteHeaderIcons;
