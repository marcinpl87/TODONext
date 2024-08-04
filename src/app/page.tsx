'use client';

import { type FormEvent, useState } from 'react';

const Home = () => {
	const [isLoading, setIsLoading] = useState<boolean>(false);

	async function onSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		setIsLoading(true); // Set loading to true when the request starts

		try {
			const formData = new FormData(event.currentTarget);
			const response = await fetch('/api/login', {
				method: 'POST',
				body: formData,
			});

			// Handle response if necessary
			const data = await response.json();

			console.log('API response', data);

			// ...
		} catch (error) {
			// Handle error if necessary
			console.error(error);
		} finally {
			setIsLoading(false); // Set loading to false when the request completes
		}
	}

	return (
		<main className="flex min-h-screen flex-col items-center justify-between p-24">
			<div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm md:flex">
				<h2 className="text-center text-2xl font-bold mb-4">Login</h2>
				<form onSubmit={onSubmit}>
					<div className="mb-4">
						<label
							className="block text-gray-400 text-sm font-bold mb-2"
							htmlFor="username"
						>
							Username
						</label>
						<input
							className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
							id="username"
							name="username"
							type="text"
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
							className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
							id="password"
							name="password"
							type="password"
							placeholder="********"
						/>
					</div>
					<div className="flex items-center justify-between">
						<input
							className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
							type="submit"
							value={isLoading ? 'Loading...' : 'Login'}
						/>
					</div>
				</form>
			</div>
		</main>
	);
};

export default Home;
