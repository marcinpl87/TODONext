'use client';

import React from 'react';
import Link from 'next/link';

const Home: React.FC = () => (
	<h2 className="text-center text-2xl font-bold mb-4">
		List of projects
		<br />
		<br />
		<Link href="project/12345678">Go to project 12345678</Link>
	</h2>
);

export default Home;
