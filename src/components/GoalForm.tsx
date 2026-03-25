'use client';

import React, { ChangeEvent, FormEvent, SetStateAction } from 'react';
import DatePicker from 'react-datepicker';
import { DATE_FORMAT } from '../consts';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { CardContent, CardFooter, CardHeader, CardTitle } from './ui/card';
import 'react-datepicker/dist/react-datepicker.css';

type GoalFormProps = {
	header: string;
	title: string;
	setTitle: (value: React.SetStateAction<string>) => void;
	description: string;
	setDescription: (value: React.SetStateAction<string>) => void;
	estimatedTime: Date | null;
	setEstimatedTime: (value: React.SetStateAction<Date | null>) => void;
	handleCancel: () => void;
	handleSubmit: (e: FormEvent) => void;
};

const GoalForm: React.FC<GoalFormProps> = ({
	header,
	title,
	setTitle,
	description,
	setDescription,
	estimatedTime,
	setEstimatedTime,
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
					placeholder="Goal title..."
					value={title}
					onChange={(e: ChangeEvent<HTMLInputElement>) =>
						setTitle(e.target.value)
					}
					required
				/>
			</div>
			<div className="grid gap-2">
				<Label htmlFor="description">Description</Label>
				<Textarea
					id="description"
					placeholder="Please include all information relevant to your goal..."
					value={description}
					onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
						setDescription(e.target.value)
					}
				/>
			</div>
			<div className="grid gap-2">
				<Label htmlFor="date">Date</Label>
				{/* DatePicker adds new div on focus, so to not create new grid gap we wrap it in a div */}
				<div>
					<DatePicker
						id="date"
						wrapperClassName="w-full"
						selected={estimatedTime}
						onChange={date => setEstimatedTime(date)}
						dateFormat={DATE_FORMAT}
						placeholderText="Date"
						customInput={<Input />}
					/>
				</div>
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

export default GoalForm;
