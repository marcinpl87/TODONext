'use client';

import React from 'react';

type LoadingIconProps = {
	className?: string;
};

const LoadingIconTwo: React.FC<LoadingIconProps> = ({ className }) => (
	<div className={`loader-two ${className || ''}`}>
		<div className="loader-two-outter"></div>
		<div className="loader-two-inner"></div>
	</div>
);

export default LoadingIconTwo;
