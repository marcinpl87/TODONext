'use client';

import React, { useRef, useState, useReducer, ChangeEvent } from 'react';
import DatePicker from 'react-datepicker';
import TimeAgo from 'react-timeago';
import Card from './Card';
import Button from './Button';
import TodoTimer from './TodoTimer';
import type { Todo } from '../types';

type TodoItemProps = {
	todo: Todo;
	updateTodo: (todo: Todo) => void;
	removeTodo: (id: string) => void;
};

const TodoItem: React.FC<TodoItemProps> = ({
	todo,
	updateTodo,
	removeTodo,
}) => {
	const [, forceUpdate] = useReducer(x => x + 1, 0);
	const timerComponentRef = useRef(null);
	const intervalRef = useRef<NodeJS.Timeout | null>(null); // because dealing with JS setInterval to keep track of it
	const [isEditing, setIsEditing] = useState<boolean>(false);
	const [title, setTitle] = useState<string>(todo.title);
	const [description, setDescription] = useState<string>(todo.description);
	const [estimatedTime, setEstimatedTime] = useState<number>(
		todo.estimatedTime,
	);
	const [startDate, setStartDate] = useState<Date | null>(
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

	const handleSave = () => {
		updateTodo({
			...todo,
			title,
			description,
			estimatedTime,
			date: startDate,
		});
		if (
			timer !== getTimeRemainingToTimerString(getDeadTime(estimatedTime))
		) {
			setTimer(getTimeRemainingToTimerString(getDeadTime(estimatedTime)));
		}
		setIsEditing(false);
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
		updateTodo({
			...todo,
			isDone: !todo.isDone,
			doneTimestamp: Date.now(),
		});
		setIsEditing(false);
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
				<div>
					<input
						placeholder="Title"
						value={title}
						onChange={(e: ChangeEvent<HTMLInputElement>) =>
							setTitle(e.target.value)
						}
						required
					/>
					<br />
					<textarea
						placeholder="Description"
						value={description}
						onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
							setDescription(e.target.value)
						}
					/>
					<br />
					<input
						placeholder="Time (in seconds)"
						type="number"
						value={estimatedTime}
						onChange={(e: ChangeEvent<HTMLInputElement>) =>
							setEstimatedTime(Number(e.target.value))
						}
					/>
					<br />
					<DatePicker
						selected={startDate}
						onChange={date => setStartDate(date)}
						showTimeSelect
						timeFormat="HH:mm"
						timeIntervals={15}
						dateFormat="yyyy-MM-dd HH:mm"
						placeholderText="Date"
					/>
					<br />
					<Button onClick={handleSave}>Save</Button>{' '}
					<Button onClick={handleCancel}>Cancel</Button>
					<br />
					<br />
				</div>
			) : (
				<div>
					<h2 className="text-xl font-bold mb-5">{todo.title}</h2>
					<p>
						{!todo.isDone && (
							<>
								{!intervalRef.current ? (
									<Button onClick={handleStart}>▶</Button>
								) : (
									<Button onClick={handlePause}>
										&nbsp;II&nbsp;
									</Button>
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
						<Button onClick={toggleDone}>
							{todo.isDone ? '❎' : '✔️'}
						</Button>{' '}
						<Button onClick={handleEdit}>✏️</Button>{' '}
						<Button onClick={handleRemove}>🗑️</Button>{' '}
						{todo.creationTimestamp && (
							<>
								(
								<TimeAgo
									date={new Date(todo.creationTimestamp)}
								/>
								{todo.isDone && todo.doneTimestamp && (
									<>
										{' - '}
										<TimeAgo
											date={new Date(todo.doneTimestamp)}
										/>
									</>
								)}
								)
							</>
						)}
					</p>
					{!todo.isDone && (
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
					)}
					<p className="mt-5">{todo.description}</p>
					{todo.date && (
						<p className="mt-5">
							{new Date(todo.date?.toString() || '')
								.toLocaleString('sv-SE')
								.slice(0, -3)}
						</p>
					)}
				</div>
			)}
		</Card>
	);
};

export default TodoItem;
