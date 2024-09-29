'use client';

import React, { useRef, useState, useReducer, FormEvent } from 'react';
import Card from './Card';
import TodoForm from './TodoForm';
import TodoTimer from './TodoTimer';
import TodoControls from './TodoControls';
import type { Todo } from '../types';
import MyTimeAgo from './MyTimeAgo';

type TodoItemProps = {
	todo: Todo;
	updateTodo: (todo: Todo, callback: () => void) => void;
	removeTodo: (id: string) => void;
};

const TodoItem: React.FC<TodoItemProps> = ({
	todo,
	updateTodo,
	removeTodo,
}) => {
	const [, forceUpdate] = useReducer(x => x + 1, 0);
	const timerComponentRef = useRef<HTMLDivElement>(null);
	const intervalRef = useRef<NodeJS.Timeout | null>(null); // because dealing with JS setInterval to keep track of it
	const [isEditing, setIsEditing] = useState<boolean>(false);
	const [title, setTitle] = useState<string>(todo.title);
	const [description, setDescription] = useState<string>(todo.description);
	const [estimatedTime, setEstimatedTime] = useState<number>(
		todo.estimatedTime,
	);
	const [startDate, setStartDate] = useState<Date | null | undefined>(
		todo.date ? new Date(todo.date || '') : null,
	);

	const getDeadTime = (seconds: number) => {
		const deadline = new Date();
		deadline.setSeconds(deadline.getSeconds() + seconds);
		return deadline;
	};

	const getTimeRemaining = (e: Date) => {
		const total =
			Date.parse(e.toString()) - Date.parse(new Date().toString());
		const seconds = Math.floor((total / 1000) % 60);
		const minutes = Math.floor((total / 1000 / 60) % 60);
		const hours = Math.floor((total / 1000 / 60 / 60) % 24);
		return {
			total,
			hours,
			minutes,
			seconds,
		};
	};

	const getTimeRemainingToTimerString = (e: Date) => {
		const { total, hours, minutes, seconds } = getTimeRemaining(e);
		// check if less than 10 then we need to
		// add '0' at the beginning of the variable
		return total >= 0
			? (hours > 9 ? hours : '0' + hours) +
					':' +
					(minutes > 9 ? minutes : '0' + minutes) +
					':' +
					(seconds > 9 ? seconds : '0' + seconds)
			: '00:00:00';
	};

	const handleEdit = () => {
		setIsEditing(true);
	};

	const handleSubmit = (e: FormEvent) => {
		e.preventDefault();
		updateTodo(
			{
				...todo,
				title,
				description,
				estimatedTime,
				date: startDate,
			},
			() => {
				if (
					timer !==
					getTimeRemainingToTimerString(getDeadTime(estimatedTime))
				) {
					setTimer(
						getTimeRemainingToTimerString(
							getDeadTime(estimatedTime),
						),
					);
				}
				setIsEditing(false);
			},
		);
	};

	const handleCancel = () => {
		setIsEditing(false);
	};

	const handleStart = () => {
		if (timerComponentRef.current) {
			(timerComponentRef.current as any).onClickStart();
		}
	};

	const handlePause = () => {
		if (timerComponentRef.current) {
			(timerComponentRef.current as any).onClickPause();
		}
		forceUpdate();
	};

	const handleStop = () => {
		if (timerComponentRef.current) {
			(timerComponentRef.current as any).onClickStop();
		}
	};

	const toggleDone = () => {
		updateTodo(
			{
				...todo,
				isDone: !todo.isDone,
				doneTimestamp: Date.now(),
			},
			() => {
				setIsEditing(false);
			},
		);
	};

	const handleRemove = () => {
		removeTodo(todo.id);
	};

	const [timer, setTimer] = useState<string>(
		getTimeRemainingToTimerString(getDeadTime(todo.estimatedTime)),
	);

	return (
		<Card as="li">
			{isEditing ? (
				<form onSubmit={handleSubmit}>
					<TodoForm
						title={title}
						setTitle={setTitle}
						description={description}
						setDescription={setDescription}
						startDate={startDate}
						setStartDate={setStartDate}
						estimatedTime={estimatedTime}
						setEstimatedTime={setEstimatedTime}
						handleCancel={handleCancel}
					/>
				</form>
			) : (
				<div>
					<h2 className="text-xl font-bold mb-5">
						{todo.date && (
							<>
								{new Date(todo.date?.toString() || '')
									.toLocaleString('sv-SE')
									.slice(0, -3)}
								{' | '}
							</>
						)}
						{!todo.isDone && (
							<>
								<TodoTimer
									ref={timerComponentRef}
									intervalRef={intervalRef}
									getDeadTime={getDeadTime}
									getTimeRemaining={getTimeRemaining}
									getTimeRemainingToTimerString={
										getTimeRemainingToTimerString
									}
									timer={timer}
									setTimer={setTimer}
									sec={todo.estimatedTime}
									toggleDone={toggleDone}
									todoTitle={todo.title}
								/>
								{' | '}
							</>
						)}
						{todo.creationTimestamp && (
							<>
								<MyTimeAgo millis={todo.creationTimestamp} />
								{todo.isDone && todo.doneTimestamp && (
									<>
										{' - '}
										<MyTimeAgo
											millis={todo.doneTimestamp}
										/>
									</>
								)}
							</>
						)}
					</h2>
					<h2 className="text-xl font-bold break-words">
						{todo.title}
					</h2>
					{todo.description && (
						<p className="mt-5 whitespace-pre-line break-words">
							{todo.description}
						</p>
					)}
					<TodoControls
						todo={todo}
						timer={timer}
						intervalRefCurrent={intervalRef.current}
						handleStart={handleStart}
						handlePause={handlePause}
						handleStop={handleStop}
						handleEdit={handleEdit}
						handleRemove={handleRemove}
						toggleDone={toggleDone}
						getDeadTime={getDeadTime}
						getTimeRemainingToTimerString={
							getTimeRemainingToTimerString
						}
					/>
				</div>
			)}
		</Card>
	);
};

export default TodoItem;
