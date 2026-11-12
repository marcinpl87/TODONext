'use client';

import React, { useState, FormEvent } from 'react';
import { PenLine, Trash } from 'lucide-react';
import { Card, CardContent, CardHeader } from './ui/card';
import HabitForm from './HabitForm';
import MyAvatar from './MyAvatar';
import { useLogin } from '../hooks/app';
import IconButton from './IconButton';
import type { Habit } from '../types/project';

type HabitItemProps = {
	habit: Habit;
	updateHabit: (
		habit: Habit,
		callback: () => void,
		errorCallback?: () => void,
	) => void;
	removeHabit: (id: string, title: string) => void;
};

const HabitItem: React.FC<HabitItemProps> = ({
	habit,
	updateHabit,
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
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
						<div className="text-2xl font-bold break-words">
							{habit.title}
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
