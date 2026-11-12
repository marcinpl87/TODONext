'use client';

import React, { ChangeEvent, FormEvent } from 'react';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { CardContent, CardFooter, CardHeader, CardTitle } from './ui/card';

type HabitFormProps = {
	header: string;
	title: string;
	setTitle: (value: React.SetStateAction<string>) => void;
	handleCancel: () => void;
	handleSubmit: (e: FormEvent) => void;
};

const HabitForm: React.FC<HabitFormProps> = ({
	header,
	title,
	setTitle,
	handleCancel,
	handleSubmit,
}) => (
	<form onSubmit={handleSubmit}>
		<CardHeader>
			<CardTitle>{header}</CardTitle>
		</CardHeader>
		<CardContent className="grid gap-6">
			<div className="grid gap-2">
				<Label htmlFor="title">Title</Label>
				<Input
					id="title"
					placeholder="Habit title..."
					value={title}
					onChange={(e: ChangeEvent<HTMLInputElement>) =>
						setTitle(e.target.value)
					}
					required
				/>
			</div>
		</CardContent>
		<CardFooter className="justify-between space-x-2">
			<Button
				variant="ghost"
				onClick={e => {
					e.preventDefault();
					handleCancel();
				}}
			>
				Cancel
			</Button>
			<Button variant="outline" type="submit">
				Save
			</Button>
		</CardFooter>
	</form>
);

export default HabitForm;
