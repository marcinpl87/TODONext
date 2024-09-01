'use client';

import React from 'react';
import { useDispatchLogin } from '../hooks';
import { LOGIN_ACTIONS, type LoginState } from '../types';

const TopBar: React.FC<{ loginState: LoginState }> = ({ loginState }) => {
	const dispatchLogin = useDispatchLogin();

	return (
		<div className="mb-4">
			Topbar menu ({loginState.userId}){' '}
			<button
				className="underline"
				onClick={() =>
					dispatchLogin({ action: LOGIN_ACTIONS.LOGOUT, userId: '' })
				}
			>
				(logout)
			</button>
		</div>
	);
};

export default TopBar;
