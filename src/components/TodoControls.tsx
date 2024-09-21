'use client';

import React from 'react';
import Button from './Button';
import MyTimeAgo from './MyTimeAgo';
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
					<Button onClick={handleStart}>▶</Button>
				) : (
					<Button onClick={handlePause}>&nbsp;II&nbsp;</Button>
				)}{' '}
				<Button
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
					◼
				</Button>{' '}
			</>
		)}
		<Button onClick={toggleDone}>{todo.isDone ? '❎' : '✔️'}</Button>{' '}
		<Button onClick={handleEdit}>✏️</Button>{' '}
		<Button onClick={handleRemove}>🗑️</Button>{' '}
		{todo.creationTimestamp && (
			<>
				(
				<MyTimeAgo millis={todo.creationTimestamp} />
				{todo.isDone && todo.doneTimestamp && (
					<>
						{' - '}
						<MyTimeAgo millis={todo.doneTimestamp} />
					</>
				)}
				)
			</>
		)}
	</p>
);

export default TodoControls;
