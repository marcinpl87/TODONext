'use client';

import React, { ChangeEvent, Dispatch, FormEvent, SetStateAction } from 'react';
import DatePicker from 'react-datepicker';
import { DATETIME_FORMAT } from '../consts';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { CardContent, CardFooter, CardHeader, CardTitle } from './ui/card';
import DynamicInputsList from './DynamicInputsList';
import 'react-datepicker/dist/react-datepicker.css';

type TodoFormProps = {
	header: string;
	title: string;
	setTitle: (value: React.SetStateAction<string>) => void;
	description: string;
	setDescription: (value: React.SetStateAction<string>) => void;
	subtasks: string[];
	setSubtasks: Dispatch<SetStateAction<string[]>>;
	estimatedTime: number;
	setEstimatedTime: (value: React.SetStateAction<number>) => void;
	startDate: Date | null | undefined;
	setStartDate: (
		value: React.SetStateAction<Date | null | undefined>,
	) => void;
	handleCancel: () => void;
	handleSubmit: (e: FormEvent) => void;
};

const TodoForm: React.FC<TodoFormProps> = ({
	header,
	title,
	setTitle,
	description,
	setDescription,
	subtasks,
	setSubtasks,
	estimatedTime,
	setEstimatedTime,
	startDate,
	setStartDate,
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
					placeholder="TODO title..."
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
					placeholder="Please include all information relevant to your TODO..."
					value={description}
					onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
						setDescription(e.target.value)
					}
				/>
			</div>
			<div className="grid gap-2">
				<DynamicInputsList
					label="Subtasks"
					inputs={subtasks}
					setInputs={setSubtasks}
				/>
			</div>
			<div className="grid gap-2">
				<Label htmlFor="estimatedTime">
					Estimated time (is seconds)
				</Label>
				<Input
					id="estimatedTime"
					type="number"
					value={estimatedTime}
					onChange={(e: ChangeEvent<HTMLInputElement>) =>
						setEstimatedTime(Number(e.target.value))
					}
					required
				/>
			</div>
			<div className="grid gap-2">
				<Label htmlFor="date">Date</Label>
				{/* DatePicker adds new div on focus, so to not create new grid gap we wrap it in a div */}
				<div>
					<DatePicker
						id="date"
						wrapperClassName="w-full"
						selected={startDate}
						onChange={date => setStartDate(date)}
						showTimeSelect
						timeFormat="HH:mm"
						timeIntervals={15}
						dateFormat={DATETIME_FORMAT}
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

export default TodoForm;
