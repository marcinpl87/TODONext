'use client';

import React, { type FormEvent, useState } from 'react';
import { authClient } from '../lib/auth-client';
import { Button } from './ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';

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

	const errorClassName = isError
		? 'border-destructive focus-visible:ring-destructive'
		: undefined;

	return (
		<div className="flex min-h-screen w-full items-center justify-center px-5">
			<Card className="w-full max-w-md">
				<form onSubmit={onSubmit}>
					<CardHeader>
						<CardTitle>Login</CardTitle>
					</CardHeader>
					<CardContent className="grid gap-6">
						<div className="grid gap-2">
							<Label htmlFor="email">Email</Label>
							<Input
								id="email"
								name="email"
								type="email"
								required
								autoComplete="email"
								placeholder="Email"
								disabled={isLoading}
								aria-invalid={isError}
								className={errorClassName}
							/>
						</div>
						<div className="grid gap-2">
							<Label htmlFor="password">Password</Label>
							<Input
								id="password"
								name="password"
								type="password"
								required
								minLength={8}
								autoComplete="current-password"
								placeholder="********"
								disabled={isLoading}
								aria-invalid={isError}
								className={errorClassName}
							/>
						</div>
						{isError ? (
							<p className="text-sm font-medium text-destructive">
								{errorMessage}
							</p>
						) : null}
					</CardContent>
					<CardFooter className="justify-end">
						<Button
							variant="outline"
							type="submit"
							disabled={isLoading}
						>
							{isLoading ? 'Loading...' : 'Login'}
						</Button>
					</CardFooter>
				</form>
			</Card>
		</div>
	);
};

export default LoginForm;
