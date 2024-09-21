'use client';

import { useTheme } from 'next-themes';
import React from 'react';

type LoadingIconProps = {
	className?: string;
};

const LoadingIcon: React.FC<LoadingIconProps> = ({ className }) => {
	const { theme } = useTheme();

	return (
		<div className={`loader__icon ${className || ''}`}>
			<svg
				version="1.1"
				id="loader-1"
				xmlns="http://www.w3.org/2000/svg"
				xmlnsXlink="http://www.w3.org/1999/xlink"
				x="0px"
				y="0px"
				width="80px"
				height="80px"
				viewBox="0 0 40 40"
				enableBackground="new 0 0 40 40"
				xmlSpace="preserve"
			>
				<path
					opacity="0.2"
					fill={theme === 'light' ? '#000' : '#fff'}
					d="
					M 20,5
					A 15,15 0 1,0 20,35
					A 15,15 0 1,0 20,5
					M 20,10
					A 10,10 0 1,1 20,30
					A 10,10 0 1,1 20,10
				"
				/>
				<path
					fill={theme === 'light' ? '#000' : '#fff'}
					d="
					M 20,5
					A 15,15,0,0,1,35,20
					L 30,20
					A 10,10,0,0,0,20,10
					Z
				"
				></path>
				<animateTransform
					attributeType="xml"
					attributeName="transform"
					type="rotate"
					from="0 40 40"
					to="360 40 40"
					dur="1s"
					repeatCount="indefinite"
				></animateTransform>
			</svg>
		</div>
	);
};

export default LoadingIcon;
