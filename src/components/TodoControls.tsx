'use client';

import React from 'react';
import Link from 'next/link';
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
import { Button } from './ui/button';
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
	<p className="mt-5">
		{!todo.isDone && (
			<>
				{!intervalRefCurrent ? (
					<Button variant="ghost" size="icon" onClick={handleStart}>
						<Play className="size-5" />
					</Button>
				) : (
					<Button variant="ghost" size="icon" onClick={handlePause}>
						<Pause className="size-5" />
					</Button>
				)}
				<Button
					variant="ghost"
					size="icon"
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
				</Button>
			</>
		)}
		<Button variant="ghost" size="icon" onClick={toggleDone}>
			{todo.isDone ? (
				<Undo className="size-5" />
			) : (
				<CircleCheckBig className="size-5" />
			)}
		</Button>
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
				<Button variant="ghost" size="icon">
					<CalendarPlus className="size-5" />
				</Button>
			</Link>
		)}
		<Button variant="ghost" size="icon" onClick={handleEdit}>
			<PenLine className="size-5" />
		</Button>
		<Button variant="ghost" size="icon" onClick={handleRemove}>
			<Trash className="size-5" />
		</Button>
	</p>
);

export default TodoControls;
