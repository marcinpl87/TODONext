'use client';

import React, { ChangeEvent } from 'react';
import DatePicker from 'react-datepicker';
import { DATE_FORMAT, DEFAULT_TIMEOUT } from '../consts';
import Button from './Button';
import InputText from './InputText';

type TodoFormProps = {
	title: string;
	setTitle: (value: React.SetStateAction<string>) => void;
	description: string;
	setDescription: (value: React.SetStateAction<string>) => void;
	estimatedTime: number;
	setEstimatedTime: (value: React.SetStateAction<number>) => void;
	startDate: Date | null | undefined;
	setStartDate: (
		value: React.SetStateAction<Date | null | undefined>,
	) => void;
	handleCancel: () => void;
};

const TodoForm: React.FC<TodoFormProps> = ({
	title,
	setTitle,
	description,
	setDescription,
	estimatedTime,
	setEstimatedTime,
	startDate,
	setStartDate,
	handleCancel,
}) => (
	<>
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
			value={estimatedTime || DEFAULT_TIMEOUT}
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
			dateFormat={DATE_FORMAT}
			placeholderText="Date"
			customInput={<InputText />}
		/>
		<div className="block mt-5 text-right">
			<Button className="mr-5" type="submit">
				Save
			</Button>
			<Button onClick={handleCancel}>Cancel</Button>
		</div>
	</>
);

export default TodoForm;
