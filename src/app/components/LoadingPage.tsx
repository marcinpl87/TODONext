'use client';

import React from 'react';
import LoadingIcon from './LoadingIcon';

const LoadingPage: React.FC = () => (
	<>
		<div className="loader">
			<LoadingIcon />
			<div className="loader__tile"></div>
			<div className="loader__tile"></div>
			<div className="loader__tile"></div>
			<div className="loader__tile"></div>
			<div className="loader__tile"></div>
		</div>
	</>
);

export default LoadingPage;
