'use client';

import React from 'react';
import { useDispatchLogin } from '../hooks';
import { LOGIN_ACTIONS } from '../types';

const TopBar: React.FC = () => {
	const dispatchLogin = useDispatchLogin();

	return (
		<div className="mb-4">
			Topbar menu{' '}
			<button onClick={() => dispatchLogin(LOGIN_ACTIONS.LOGOUT)}>
				(logout)
			</button>
		</div>
	);
};

export default TopBar;
