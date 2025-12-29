'use client';

import React, { useRef, useState, useReducer, FormEvent } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import TodoForm from './TodoForm';
import TodoTimer from './TodoTimer';
import TodoControls from './TodoControls';
import MyTimeAgo from './MyTimeAgo';
import MyAvatar from './MyAvatar';
import { useLogin } from '../hooks';
import { SUBTASK_DONE_MARKER } from '../consts';
import type { Todo } from '../types/project';

type TodoItemProps = {
	todo: Todo;
	updateTodo: (
		todo: Todo,
		callback: () => void,
		errorCallback?: () => void,
	) => void;
	removeTodo: (id: string, title: string) => void;
};

const TodoItem: React.FC<TodoItemProps> = ({
	todo,
	updateTodo,
	removeTodo,
}) => {
	const login = useLogin();
	const [, forceUpdate] = useReducer(x => x + 1, 0);
	const timerComponentRef = useRef<HTMLDivElement>(null);
	const intervalRef = useRef<NodeJS.Timeout | null>(null); // because dealing with JS setInterval to keep track of it
	const [isEditing, setIsEditing] = useState<boolean>(false);
	const [title, setTitle] = useState<string>(todo.title);
	const [description, setDescription] = useState<string>(todo.description);
	const [subtasks, setSubtasks] = useState<string[]>(
		(
			todo?.subtasks?.data
				?.map(s =>
					s.isDone ? `${SUBTASK_DONE_MARKER}${s.task}` : s.task,
				)
				.filter(Boolean) || []
		).concat(''),
	); // empty subtask at the end to allow user to add more
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
				subtasks: {
					data: subtasks.filter(Boolean).map(task => ({
						task: task.startsWith(SUBTASK_DONE_MARKER)
							? task.slice(2)
							: task,
						isDone: task.startsWith(SUBTASK_DONE_MARKER),
					})),
				},
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

	const toggleSubtask = (subtaskContent: string) => {
		let subtasksToSave: string[] = [];
		const subtasksCache: string[] = [...subtasks];
		setSubtasks(prevSubtasks => {
			subtasksToSave = prevSubtasks.map(subtask => {
				if (subtask === subtaskContent) {
					if (subtask.startsWith(SUBTASK_DONE_MARKER)) {
						return subtask.slice(2); // Remove SUBTASK_DONE_MARKER if it exists
					} else {
						return `${SUBTASK_DONE_MARKER}${subtask}`; // Add SUBTASK_DONE_MARKER if it doesn't exist
					}
				}
				return subtask;
			});
			return subtasksToSave;
		});
		updateTodo(
			{
				...todo,
				subtasks: {
					data: subtasksToSave.filter(Boolean).map(task => ({
						task: task.startsWith(SUBTASK_DONE_MARKER)
							? task.slice(2)
							: task,
						isDone: task.startsWith(SUBTASK_DONE_MARKER),
					})),
				},
			},
			() => {},
			() => {
				setSubtasks(subtasksCache);
			},
		);
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
		removeTodo(todo.id, todo.title);
	};

	const [timer, setTimer] = useState<string>(
		getTimeRemainingToTimerString(getDeadTime(todo.estimatedTime)),
	);

	return (
		<Card className="w-full max-w-4xl mb-5">
			{isEditing ? (
				<TodoForm
					header="Edit TODO"
					title={title}
					setTitle={setTitle}
					description={description}
					setDescription={setDescription}
					subtasks={subtasks}
					setSubtasks={setSubtasks}
					startDate={startDate}
					setStartDate={setStartDate}
					estimatedTime={estimatedTime}
					setEstimatedTime={setEstimatedTime}
					handleCancel={handleCancel}
					handleSubmit={handleSubmit}
				/>
			) : (
				<>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-md font-mono">
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
							{todo.creationTimestamp &&
								+todo.creationTimestamp > 0 && (
									<>
										<MyTimeAgo
											millis={+todo.creationTimestamp}
										/>
										{todo.isDone &&
											todo.doneTimestamp &&
											+todo.doneTimestamp > 0 && (
												<>
													{' - '}
													<MyTimeAgo
														millis={
															+todo.doneTimestamp
														}
													/>
												</>
											)}
									</>
								)}
						</CardTitle>
						<MyAvatar
							name={
								login.users.find(
									user => user.id === todo.userId,
								)?.name || ''
							}
						/>
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold break-words">
							{todo.title}
						</div>
						<p className="text-md text-muted-foreground whitespace-pre-line break-words pt-1 pb-3">
							{todo.description}
						</p>
						{subtasks.filter(Boolean).length > 0 && (
							<div className="text-md text-muted-foreground whitespace-pre-line break-words pb-2">
								{subtasks
									.filter(Boolean)
									.map((subtask, index) => (
										<React.Fragment key={index}>
											<label
												className="cursor-pointer inline-flex"
												onChange={() => {
													toggleSubtask(subtask);
												}}
											>
												<input
													type="checkbox"
													checked={subtask.startsWith(
														SUBTASK_DONE_MARKER,
													)}
													readOnly
												/>
												<span className="ml-1 mb-0.5">
													{subtask.startsWith(
														SUBTASK_DONE_MARKER,
													)
														? subtask.slice(2)
														: subtask}
												</span>
											</label>
											<br />
										</React.Fragment>
									))}
							</div>
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
					</CardContent>
				</>
			)}
		</Card>
	);
};

export default TodoItem;
