import * as React from 'react';
import Link from 'next/link';
import { cn } from '../utils';
import { siteConfig } from '../config';
import type { NavItem } from '../types';

type MainNavProps = {
	items?: NavItem[];
};

const MainNav: React.FC<MainNavProps> = ({ items }) => (
	<div className="flex gap-6 md:gap-10">
		<Link href="/" className="flex items-center space-x-2">
			<span className="inline-block font-bold">{siteConfig.name}</span>
		</Link>
		{items?.length ? (
			<nav className="flex gap-6">
				{items?.map(
					(item, index) =>
						item.href && (
							<Link
								key={index}
								href={item.href}
								className={cn(
									'flex items-center text-sm font-medium text-muted-foreground',
									item.disabled &&
										'cursor-not-allowed opacity-80',
								)}
							>
								{item.title}
							</Link>
						),
				)}
			</nav>
		) : null}
	</div>
);

export default MainNav;