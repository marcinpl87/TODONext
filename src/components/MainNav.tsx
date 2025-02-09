import * as React from 'react';
import { usePathname } from 'next/navigation';
import { Link } from 'next-view-transitions';
import { cn } from '../utils';
import { siteConfig } from '../config';
import type { NavItem } from '../types';

type MainNavProps = {
	items?: NavItem[];
};

const MainNav: React.FC<MainNavProps> = ({ items }) => {
	const pathname = usePathname();

	return (
		<div className="space-y-6 -mt-4 md:mt-0 md:flex md:space-x-6 md:space-y-0">
			<Link href="/" className="hidden md:flex items-center space-x-2">
				<span className="inline-block font-bold">
					{siteConfig.name}
				</span>
			</Link>
			{items?.length ? (
				<>
					{items?.map(
						(item, index) =>
							item.href && (
								<Link
									key={index}
									href={item.href}
									className={cn(
										'flex items-center text-sm font-medium text-muted-foreground',
										'transition-colors',
										pathname === item.href
											? 'text-foreground cursor-default'
											: 'text-foreground/60 hover:text-foreground/80',
									)}
								>
									{item.title}
								</Link>
							),
					)}
				</>
			) : null}
		</div>
	);
};

export default MainNav;
