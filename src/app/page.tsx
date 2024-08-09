'use client';

import { type FormEvent, useState } from 'react';

const Home = () => {
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
				window.location.href = '/dashboard';
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
		<main className="flex min-h-screen flex-col items-center justify-between p-24">
			<div className="z-10 w-full max-w-4xl items-center justify-between font-mono text-sm sm:flex">
				<h2 className="text-center text-2xl font-bold mb-4">Login</h2>
				<form onSubmit={onSubmit} className="sm:w-1/2">
					<div className="mb-4">
						<label
							className="block text-gray-400 text-sm font-bold mb-2"
							htmlFor="username"
						>
							Username
						</label>
						<input
							className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${isError && 'border-2 border-red-700'}`}
							id="username"
							name="username"
							type="text"
							required
							placeholder="Username"
						/>
					</div>
					<div className="mb-6">
						<label
							className="block text-gray-400 text-sm font-bold mb-2"
							htmlFor="password"
						>
							Password
						</label>
						<input
							className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline ${isError && 'border-2 border-red-700'}`}
							id="password"
							name="password"
							type="password"
							required
							placeholder="********"
						/>
						{isError && (
							<p className="text-red-500 text-xs font-bold">
								Invalid username or password!
							</p>
						)}
					</div>
					<div className="flex flex-row-reverse items-center justify-between text-right">
						<input
							className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
							type="submit"
							disabled={isLoading}
							value={isLoading ? 'Loading...' : 'Login'}
						/>
					</div>
				</form>
			</div>
		</main>
	);
};

export default Home;
