'use client';

import React from 'react';
import { Button } from './ui/button';
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from './ui/tooltip';

interface IconButtonProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	children: React.ReactNode;
	tooltip?: string;
}

const IconButton: React.FC<IconButtonProps> = ({
	tooltip,
	children,
	...rest
}) => (
	<TooltipProvider>
		<Tooltip>
			<TooltipTrigger asChild>
				<Button
					variant="outline"
					size="icon"
					className="mr-3"
					{...rest}
				>
					{children}
				</Button>
			</TooltipTrigger>
			{tooltip && (
				<TooltipContent>
					<p>{tooltip}</p>
				</TooltipContent>
			)}
		</Tooltip>
	</TooltipProvider>
);

export default IconButton;
