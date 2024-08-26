'use client';

import React, { useState, FormEvent, ChangeEvent } from 'react';
import DatePicker from 'react-datepicker';
import { v4 as uuidv4 } from 'uuid';
import Card from './Card';
import Button from './Button';
import InputText from './InputText';
import type { Todo } from '../types';

type TodoFormProps = {
	addTodo: (todo: Todo) => void;
	projectId: string;
};

const TodoForm: React.FC<TodoFormProps> = ({ addTodo, projectId }) => {
	const [isOpened, setIsOpened] = useState<boolean>(false);
	const [title, setTitle] = useState<string>('');
	const [description, setDescription] = useState<string>('');
	const [estimatedTime, setEstimatedTime] = useState<number>(0);
	const [startDate, setStartDate] = useState<Date | null>();

	const handleSubmit = (e: FormEvent) => {
		e.preventDefault();
		addTodo({
			id: uuidv4(),
			projectId: projectId || '',
			title,
			date: startDate || null,
			description,
			estimatedTime,
			isDone: false,
			doneTimestamp: 0,
			creationTimestamp: Date.now(),
		});
		setTitle('');
		setDescription('');
		setEstimatedTime(0);
		setIsOpened(false);
	};

	return (
		<>
			{isOpened ? (
				<Card as="form" onSubmit={handleSubmit}>
					<InputText
						type="text"
						placeholder="Title"
						value={title}
						onChange={(e: ChangeEvent<HTMLInputElement>) =>
							setTitle(e.target.value)
						}
						required
					/>
					<InputText
						className="mt-5 block"
						as="textarea"
						placeholder="Description"
						value={description}
						onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
							setDescription(e.target.value)
						}
					/>
					<InputText
						className="mt-5"
						type="number"
						placeholder="Time (is seconds)"
						value={estimatedTime || ''}
						onChange={(e: ChangeEvent<HTMLInputElement>) =>
							setEstimatedTime(Number(e.target.value))
						}
						required
					/>
					<DatePicker
						wrapperClassName="mt-5 w-full"
						selected={startDate}
						onChange={date => setStartDate(date)}
						showTimeSelect
						timeFormat="HH:mm"
						timeIntervals={15}
						dateFormat="yyyy-MM-dd HH:mm"
						placeholderText="Date"
						customInput={<InputText />}
					/>
					<div className="block mt-5 text-right">
						<Button className="mr-5" type="submit">
							Save
						</Button>
						<Button onClick={() => setIsOpened(false)}>
							Cancel
						</Button>
					</div>
				</Card>
			) : (
				<Button className="mb-5" onClick={() => setIsOpened(true)}>
					New TODO
				</Button>
			)}
		</>
	);
};

export default TodoForm;
