'use client';

import React, { useState } from 'react';
import TimeAgo from 'react-timeago';
import { DateTime } from 'luxon';
import { DATE_FORMAT } from '../consts';

type MyTimeAgoProps = {
	millis: number;
};

const MyTimeAgo: React.FC<MyTimeAgoProps> = ({ millis }) => {
	const [isCount, setIsCount] = useState<boolean>(true);
	const formattedDate = DateTime.fromMillis(millis).toFormat(DATE_FORMAT);

	return (
		<span
			onClick={() => {
				setIsCount(v => !v);
			}}
		>
			{isCount ? (
				<TimeAgo date={new Date(millis)} title={formattedDate} />
			) : (
				formattedDate
			)}
		</span>
	);
};

export default MyTimeAgo;
