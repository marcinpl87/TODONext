'use client';

import React from 'react';
import { Link } from 'next-view-transitions';
import { DateTime } from 'luxon';
import {
	CalendarPlus,
	CircleCheckBig,
	Pause,
	PenLine,
	Play,
	Square,
	Trash,
	Undo,
} from 'lucide-react';
import IconButton from './IconButton';
import type { Todo } from '../types';

type TodoControlsProps = {
	todo: Todo;
	timer: string;
	intervalRefCurrent: NodeJS.Timeout | null;
	handleStart: () => void;
	handlePause: () => void;
	handleStop: () => void;
	handleEdit: () => void;
	handleRemove: () => void;
	toggleDone: () => void;
	getDeadTime: (seconds: number) => Date;
	getTimeRemainingToTimerString: (e: Date) => string;
};

const TodoControls: React.FC<TodoControlsProps> = ({
	todo,
	timer,
	intervalRefCurrent,
	handleStart,
	handlePause,
	handleStop,
	handleEdit,
	handleRemove,
	toggleDone,
	getDeadTime,
	getTimeRemainingToTimerString,
}) => (
	<>
		{!todo.isDone && (
			<>
				{!intervalRefCurrent ? (
					<IconButton tooltip="Start" onClick={handleStart}>
						<Play className="size-5" />
					</IconButton>
				) : (
					<IconButton tooltip="Pause" onClick={handlePause}>
						<Pause className="size-5" />
					</IconButton>
				)}
				<IconButton
					tooltip="Stop"
					disabled={
						!(
							timer !==
							getTimeRemainingToTimerString(
								getDeadTime(todo.estimatedTime),
							)
						)
					}
					onClick={handleStop}
				>
					<Square className="size-5" />
				</IconButton>
			</>
		)}
		<IconButton
			tooltip={`Mark as ${todo.isDone ? 'undone' : 'done'}`}
			onClick={toggleDone}
		>
			{todo.isDone ? (
				<Undo className="size-5" />
			) : (
				<CircleCheckBig className="size-5" />
			)}
		</IconButton>
		{todo.date && !todo.isDone && (
			<Link
				href={`https://calendar.google.com/calendar/u/0/r/eventedit?dates=${DateTime.fromJSDate(
					todo.date,
				)
					.toFormat('yyyyMMdd HHmmss')
					.replace(' ', 'T')}/${DateTime.fromMillis(
					DateTime.fromJSDate(todo.date).toMillis() +
						todo.estimatedTime * 1000,
				)
					.toFormat('yyyyMMdd HHmmss')
					.replace(
						' ',
						'T',
					)}&text=${encodeURI(todo.title)}&details=${encodeURI(todo.description)}`}
				target="_blank"
				rel="noreferrer"
			>
				<IconButton tooltip="Add to calendar">
					<CalendarPlus className="size-5" />
				</IconButton>
			</Link>
		)}
		<IconButton tooltip="Edit" onClick={handleEdit}>
			<PenLine className="size-5" />
		</IconButton>
		<IconButton tooltip="Delete" onClick={handleRemove}>
			<Trash className="size-5" />
		</IconButton>
	</>
);

export default TodoControls;
