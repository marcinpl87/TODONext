'use client';

import React, { useRef, useState, FormEvent } from 'react';
import { PenLine, Trash } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import GoalForm from './GoalForm';
import TodoTimer from './TodoTimer';
import MyAvatar from './MyAvatar';
import { useLogin } from '../hooks/app';
import IconButton from './IconButton';
import type { Goal } from '../types/project';

type GoalItemProps = {
	goal: Goal;
	updateGoal: (
		goal: Goal,
		callback: () => void,
		errorCallback?: () => void,
	) => void;
	removeGoal: (id: string, title: string) => void;
};

const GoalItem: React.FC<GoalItemProps> = ({
	goal,
	updateGoal,
	removeGoal,
}) => {
	const login = useLogin();
	const timerComponentRef = useRef<HTMLDivElement>(null);
	const intervalRef = useRef<NodeJS.Timeout | null>(null); // because dealing with JS setInterval to keep track of it
	const [isEditing, setIsEditing] = useState<boolean>(false);
	const [title, setTitle] = useState<string>(goal.title);
	const [description, setDescription] = useState<string>(goal.description);
	const [estimatedTime, setEstimatedTime] = useState<Date | null>(
		new Date(goal.estimatedTime),
	);

	const getDeadTime = (targetTimestamp: number) => {
		return new Date(targetTimestamp);
	};

	const getTimeRemaining = (e: Date) => {
		const total =
			Date.parse(e.toString()) - Date.parse(new Date().toString());
		const seconds = Math.floor((total / 1000) % 60);
		const minutes = Math.floor((total / 1000 / 60) % 60);
		const hours = Math.floor((total / 1000 / 60 / 60) % 24);
		const days = Math.floor(total / 1000 / 60 / 60 / 24);
		return {
			total,
			days,
			hours,
			minutes,
			seconds,
		};
	};

	const getTimeRemainingToTimerString = (e: Date) => {
		const { total, days, hours, minutes, seconds } = getTimeRemaining(e);
		// check if less than 10 then we need to
		// add '0' at the beginning of the variable
		// return 00:00:00 if time has passed (total <= 0)
		if (total <= 0) {
			return '00:00:00';
		}
		const timeString =
			(hours > 9 ? hours : '0' + hours) +
			':' +
			(minutes > 9 ? minutes : '0' + minutes) +
			':' +
			(seconds > 9 ? seconds : '0' + seconds);

		return days > 0 ? `${days} ${timeString}` : timeString;
	};

	const handleEdit = () => {
		setIsEditing(true);
	};

	const handleSubmit = (e: FormEvent) => {
		e.preventDefault();
		const estimatedTimestamp = estimatedTime ? estimatedTime.getTime() : 0;
		updateGoal(
			{
				...goal,
				title,
				description,
				estimatedTime: estimatedTimestamp,
			},
			() => {
				if (
					timer !==
					getTimeRemainingToTimerString(
						getDeadTime(estimatedTimestamp),
					)
				) {
					setTimer(
						getTimeRemainingToTimerString(
							getDeadTime(estimatedTimestamp),
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

	const handleRemove = () => {
		removeGoal(goal.id, goal.title);
	};

	const [timer, setTimer] = useState<string>(
		getTimeRemainingToTimerString(getDeadTime(goal.estimatedTime)),
	);

	return (
		<Card className="w-full max-w-4xl mb-5">
			{isEditing ? (
				<GoalForm
					header="Edit goal"
					title={title}
					setTitle={setTitle}
					description={description}
					setDescription={setDescription}
					estimatedTime={estimatedTime}
					setEstimatedTime={setEstimatedTime}
					handleCancel={handleCancel}
					handleSubmit={handleSubmit}
				/>
			) : (
				<>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
						<CardTitle className="text-2xl font-mono">
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
								sec={goal.estimatedTime}
								toggleDone={() => {}}
								todoTitle={goal.title}
								autoStart={true}
								disableConfirm={true}
							/>
						</CardTitle>
						<MyAvatar
							name={
								login.users.find(
									user => user.id === goal.userId,
								)?.name || ''
							}
						/>
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold break-words">
							{goal.title}
						</div>
						<p className="text-md text-muted-foreground whitespace-pre-line break-words pt-1 pb-3">
							{goal.description}
						</p>
						<IconButton tooltip="Edit" onClick={handleEdit}>
							<PenLine className="size-5" />
						</IconButton>
						<IconButton tooltip="Delete" onClick={handleRemove}>
							<Trash className="size-5" />
						</IconButton>
					</CardContent>
				</>
			)}
		</Card>
	);
};

export default GoalItem;
