'use client';

import React from 'react';
import TimeAgo from 'react-timeago';
import { DateTime } from 'luxon';
import { DATE_FORMAT } from '../consts';

type MyTimeAgoProps = {
	millis: number;
};

const MyTimeAgo: React.FC<MyTimeAgoProps> = ({ millis }) => (
	<TimeAgo
		date={new Date(millis)}
		title={DateTime.fromMillis(millis).toFormat(DATE_FORMAT)}
	/>
);

export default MyTimeAgo;
