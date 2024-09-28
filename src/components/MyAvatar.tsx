'use client';

import React from 'react';
import { Avatar, AvatarFallback } from '../components/ui/avatar';

type MyAvatarProps = {
	name?: string;
};

const MyAvatar: React.FC<MyAvatarProps> = ({ name = '?' }) => {
	const extractInitialsFromName: (name: string) => string = name => {
		const words = name.trim().split(' ');
		if (words.length > 1) {
			return `${words[0][0].toUpperCase()}${words[1][0].toUpperCase()}`;
		} else if (words[0][1]) {
			return `${words[0][0].toUpperCase()}${words[0][1].toUpperCase()}`;
		} else {
			return words[0][0]?.toUpperCase() || '';
		}
	};

	return (
		<Avatar className="size-9">
			<AvatarFallback>{extractInitialsFromName(name)}</AvatarFallback>
		</Avatar>
	);
};

export default MyAvatar;
