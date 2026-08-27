'use client';

import React, { type FormEvent, useState } from 'react';
import InputText from './InputText';
import Button from './Button';
import { authClient } from '../lib/auth-client';

const LoginForm: React.FC = () => {
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [isError, setIsError] = useState<boolean>(false);
	const [errorMessage, setErrorMessage] = useState<string>('');

	const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setIsLoading(true);
		setIsError(false);
		setErrorMessage('');
		const formData = new FormData(event.currentTarget);
		const email = String(formData.get('email') || '');
		const password = String(formData.get('password') || '');

		try {
			const { error } = await authClient.signIn.email({
				email,
				password,
			});
			if (error) {
				setIsError(true);
				setErrorMessage(error.message || 'Invalid email or password');
			}
		} catch (error) {
			setIsError(true);
			setErrorMessage('Invalid email or password');
			console.error(error);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="z-10 w-full max-w-4xl items-center justify-between font-mono sm:flex p-24">
			<h2 className="text-center text-2xl font-bold mb-4">Login</h2>
			<form onSubmit={onSubmit} className="sm:w-1/2">
				<InputText
					className="mb-4"
					id="email"
					name="email"
					type="email"
					required
					autoComplete="email"
					label="Email"
					placeholder="Email"
					disabled={isLoading}
					isError={isError}
				/>
				<InputText
					id="password"
					name="password"
					type="password"
					required
					minLength={8}
					autoComplete="current-password"
					label="Password"
					placeholder="********"
					disabled={isLoading}
					isError={isError}
				/>
				<p className="text-red-500 text-xs font-bold mt-3 mb-3">
					{isError ? errorMessage : <>&nbsp;</>}
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
