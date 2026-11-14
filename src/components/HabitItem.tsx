'use client';

import React, { useState, FormEvent } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Check, PenLine, Trash } from 'lucide-react';
import { Card, CardContent, CardHeader } from './ui/card';
import HabitForm from './HabitForm';
import MyAvatar from './MyAvatar';
import { useLogin } from '../hooks/app';
import IconButton from './IconButton';
import type { Habit, HabitDate } from '../types/project';

type HabitItemProps = {
	habit: Habit;
	updateHabit: (
		habit: Habit,
		callback: () => void,
		errorCallback?: () => void,
	) => void;
	completeHabit: (habitDate: HabitDate) => void;
	removeHabit: (id: string, title: string) => void;
};

const formatLocalDate = (date: Date) => {
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, '0');
	const day = String(date.getDate()).padStart(2, '0');
	return `${year}-${month}-${day}`;
};

const HabitItem: React.FC<HabitItemProps> = ({
	habit,
	updateHabit,
	completeHabit,
	removeHabit,
}) => {
	const login = useLogin();
	const [isEditing, setIsEditing] = useState<boolean>(false);
	const [title, setTitle] = useState<string>(habit.title);

	const handleEdit = () => {
		setIsEditing(true);
	};

	const handleSubmit = (e: FormEvent) => {
		e.preventDefault();
		updateHabit(
			{
				...habit,
				title,
			},
			() => {
				setIsEditing(false);
			},
		);
	};

	const handleCancel = () => {
		setIsEditing(false);
	};

	const handleRemove = () => {
		removeHabit(habit.id, habit.title);
	};

	const today = formatLocalDate(new Date());
	const isDoneToday = habit.dates.includes(today);

	const handleComplete = () => {
		if (isDoneToday) {
			return;
		}
		completeHabit({
			id: uuidv4(),
			userId: login.userId,
			habitId: habit.id,
			date: today,
		});
	};

	return (
		<Card className="w-full max-w-4xl mb-5">
			{isEditing ? (
				<HabitForm
					header="Edit habit"
					title={title}
					setTitle={setTitle}
					handleCancel={handleCancel}
					handleSubmit={handleSubmit}
				/>
			) : (
				<>
					<CardHeader className="flex flex-row items-start justify-between space-y-0 pb-4">
						<div className="min-w-0">
							<div className="text-2xl font-bold break-words">
								{habit.title}
							</div>
							{habit.dates.map(date => (
								<div
									key={date}
									className="text-sm text-muted-foreground pt-1"
								>
									{date}
								</div>
							))}
						</div>
						<MyAvatar
							name={
								login.users.find(
									user => user.id === habit.userId,
								)?.name || ''
							}
						/>
					</CardHeader>
					<CardContent>
						{!isDoneToday && (
							<IconButton
								tooltip="Done today"
								onClick={handleComplete}
							>
								<Check className="size-5" />
							</IconButton>
						)}
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

export default HabitItem;
