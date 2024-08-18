'use client';

import React from 'react';
import Link from 'next/link';

const Page = ({ params }: { params: { id: string } }) => {
	return (
		<div>
			PROJECT ID: {params.id}
			<br />
			<Link href="/">Go back to homepage</Link>
		</div>
	);
};

export default Page;
