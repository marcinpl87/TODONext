'use client';

import React, { type FormEvent, useState } from 'react';
import InputText from './InputText';
import Button from './Button';
import { useDispatchLogin } from '../hooks';
import { LOGIN_ACTIONS } from '../types';

const LoginForm: React.FC = () => {
	const dispatchLogin = useDispatchLogin();
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [isError, setIsError] = useState<boolean>(false);

	const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setIsLoading(true);
		setIsError(false);
		try {
			const formData = new FormData(event.currentTarget);
			const response = await fetch('/api/login', {
				method: 'POST',
				body: formData,
			});
			const data = await response.json();
			if (response.ok && data.message === 'OK') {
				setIsError(false);
				dispatchLogin({
					action: LOGIN_ACTIONS.LOGIN,
					userId: data.userId,
					userName: data.userName,
				});
			} else {
				setIsError(true);
			}
		} catch (error) {
			setIsError(true);
			console.error(error);
		} finally {
			setIsLoading(false); // Set loading to false when the request completes
		}
	};

	return (
		<div className="z-10 w-full max-w-4xl items-center justify-between font-mono sm:flex p-24">
			<h2 className="text-center text-2xl font-bold mb-4">Login</h2>
			<form onSubmit={onSubmit} className="sm:w-1/2">
				<InputText
					className="mb-4"
					id="username"
					name="username"
					type="text"
					required
					label="Username"
					placeholder="Username"
					disabled={isLoading}
					isError={isError}
				/>
				<InputText
					id="password"
					name="password"
					type="password"
					required
					label="Password"
					placeholder="********"
					disabled={isLoading}
					isError={isError}
				/>
				<p className="text-red-500 text-xs font-bold mt-3 mb-3">
					{isError ? <>Invalid username or password!</> : <>&nbsp;</>}
				</p>
				<div className="flex flex-row-reverse items-center justify-between text-right">
					<Button type="submit" disabled={isLoading}>
						{isLoading ? 'Loading...' : 'Login'}
					</Button>
				</div>
			</form>
		</div>
	);
};

export default LoginForm;
