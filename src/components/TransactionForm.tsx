'use client';

import React, { ChangeEvent, FormEvent } from 'react';
import DatePicker from 'react-datepicker';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { CardContent, CardFooter, CardHeader, CardTitle } from './ui/card';
import { DATE_FORMAT, MILISECONDS_FORMAT } from '../consts';
import 'react-datepicker/dist/react-datepicker.css';

type TransactionFormProps = {
	header: string;
	date: Date | null | undefined;
	setDate: (value: React.SetStateAction<Date | null | undefined>) => void;
	amount: number | null;
	setAmount: (value: React.SetStateAction<number | null>) => void;
	receiver: string;
	setReceiver: (value: React.SetStateAction<string>) => void;
	description: string;
	setDescription: (value: React.SetStateAction<string>) => void;
	creationTimestamp: string | null;
	setCreationTimestamp: (value: React.SetStateAction<string | null>) => void;
	handleCancel: () => void;
	handleSubmit: (e: FormEvent) => void;
};

const TransactionForm: React.FC<TransactionFormProps> = ({
	header,
	date,
	setDate,
	amount,
	setAmount,
	receiver,
	setReceiver,
	description,
	setDescription,
	creationTimestamp,
	setCreationTimestamp,
	handleCancel,
	handleSubmit,
}) => (
	<form onSubmit={handleSubmit}>
		<CardHeader>
			<CardTitle>{header}</CardTitle>
		</CardHeader>
		<CardContent className="grid gap-6">
			<div className="grid gap-2">
				<Label htmlFor="date">Date</Label>
				{/* DatePicker adds new div on focus, so to not create new grid gap we wrap it in a div */}
				<div>
					<DatePicker
						id="date"
						wrapperClassName="w-full"
						selected={date}
						onChange={setDate}
						dateFormat={DATE_FORMAT}
						placeholderText="Date"
						customInput={<Input />}
						autoComplete="off"
						required
					/>
				</div>
			</div>
			<div className="grid gap-2">
				<Label htmlFor="amount">Amount</Label>
				<Input
					id="amount"
					type="number"
					placeholder="0zł"
					value={amount || undefined}
					onChange={(e: ChangeEvent<HTMLInputElement>) =>
						setAmount(Number(e.target.value))
					}
					autoComplete="off"
					required
				/>
			</div>
			<div className="grid gap-2">
				<Label htmlFor="receiver">Receiver</Label>
				<Textarea
					id="receiver"
					placeholder="Enter the recipient of this transaction..."
					value={receiver}
					onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
						setReceiver(e.target.value)
					}
				/>
			</div>
			<div className="grid gap-2">
				<Label htmlFor="description">Description</Label>
				<Textarea
					id="description"
					placeholder="Please include all information relevant to this transaction..."
					value={description}
					onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
						setDescription(e.target.value)
					}
				/>
			</div>
			<div className="grid gap-2">
				<Label htmlFor="creationTimestamp">Creation Timestamp</Label>
				<Input
					id="creationTimestamp"
					type="string"
					placeholder={MILISECONDS_FORMAT}
					value={creationTimestamp || undefined}
					onChange={(e: ChangeEvent<HTMLInputElement>) =>
						setCreationTimestamp(e.target.value)
					}
					autoComplete="off"
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

export default TransactionForm;
