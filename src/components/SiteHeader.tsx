'use client';

import React, { useState } from 'react';
import { Menu } from 'lucide-react';
import { siteConfig } from '../config';
import { Button } from './ui/button';
import MainNav from './MainNav';
import SiteHeaderIcons from './SiteHeaderIcons';

const SiteHeader: React.FC = () => {
	const [isExpanded, setIsExpanded] = useState<boolean>(false);

	return (
		<nav className="bg-background sticky top-0 z-40 w-full border-b">
			<div className="items-center px-5 max-w-screen-xl mx-auto md:flex">
				<div className="flex items-center justify-between py-3 md:py-5 md:block">
					<div className="md:hidden">
						<Button
							className="p-2"
							variant="ghost"
							onClick={() =>
								setIsExpanded(prevState => !prevState)
							}
						>
							<Menu />
						</Button>
					</div>
					<div className="flex md:hidden flex-1 items-center justify-end space-x-4">
						<SiteHeaderIcons />
					</div>
				</div>
				<div
					className={`flex-1 justify-self-center pb-3 md:block md:pb-0 ${
						isExpanded ? 'block' : 'hidden'
					}`}
				>
					<MainNav items={siteConfig.mainNav} />
				</div>
				<div className="hidden md:flex flex-1 py-3 items-center justify-end space-x-4">
					<SiteHeaderIcons />
				</div>
			</div>
		</nav>
	);
};

export default SiteHeader;
