'use client';

import React, { ChangeEvent, FormEvent } from 'react';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { CardContent, CardFooter, CardHeader, CardTitle } from './ui/card';

type TransactionFormProps = {
	header: string;
	description: string;
	setDescription: (value: React.SetStateAction<string>) => void;
	handleCancel: () => void;
	handleSubmit: (e: FormEvent) => void;
};

const TransactionForm: React.FC<TransactionFormProps> = ({
	header,
	description,
	setDescription,
	handleCancel,
	handleSubmit,
}) => (
	<form onSubmit={handleSubmit}>
		<CardHeader>
			<CardTitle>{header}</CardTitle>
		</CardHeader>
		<CardContent className="grid gap-6">
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
