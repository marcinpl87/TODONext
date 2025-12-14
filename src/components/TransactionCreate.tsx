'use client';

import React, { useState, FormEvent } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { DateTime } from 'luxon';
import { useLogin } from '../hooks';
import { Card } from './ui/card';
import { Button } from './ui/button';
import TransactionForm from './TransactionForm';
import { MILISECONDS_FORMAT } from '../consts';
import type { Transaction } from '../types';

type TransactionCreateProps = {
	addTransaction: (transaction: Transaction, callback: () => void) => void;
};

const TransactionCreate: React.FC<TransactionCreateProps> = ({
	addTransaction,
}) => {
	const defaultTimestamp = DateTime.fromMillis(
		Number(new Date().getTime().toString()),
	).toFormat(MILISECONDS_FORMAT);
	const login = useLogin();
	const [isOpened, setIsOpened] = useState<boolean>(false);
	const [date, setDate] = useState<Date | null | undefined>(null);
	const [amount, setAmount] = useState<number | null>(null);
	const [receiver, setReceiver] = useState<string>('');
	const [description, setDescription] = useState<string>('');
	const [creationTimestamp, setCreationTimestamp] = useState<string | null>(
		defaultTimestamp,
	);

	const handleSubmit = (e: FormEvent) => {
		e.preventDefault();
		addTransaction(
			{
				id: uuidv4(),
				userId: login.userId,
				creationTimestamp: creationTimestamp
					? DateTime.fromFormat(
							creationTimestamp,
							MILISECONDS_FORMAT,
						).toMillis()
					: Date.now(),
				date,
				amount,
				receiver,
				description,
				isManual: true,
				isHidden: false,
				categoryId: null,
				amountCustom: null,
				descriptionCustom: null,
			},
			() => {
				setDate(null);
				setAmount(null);
				setReceiver('');
				setDescription('');
				setCreationTimestamp(defaultTimestamp);
				setIsOpened(false);
			},
		);
	};

	const handleCancel = () => {
		setIsOpened(false);
	};

	return (
		<>
			{isOpened ? (
				<Card className="w-full max-w-4xl mb-5">
					<TransactionForm
						header="New Transaction"
						date={date}
						setDate={setDate}
						amount={amount}
						setAmount={setAmount}
						receiver={receiver}
						setReceiver={setReceiver}
						description={description}
						setDescription={setDescription}
						creationTimestamp={creationTimestamp}
						setCreationTimestamp={setCreationTimestamp}
						handleCancel={handleCancel}
						handleSubmit={handleSubmit}
					/>
				</Card>
			) : (
				<Button
					className="mb-5"
					variant="outline"
					onClick={() => setIsOpened(true)}
				>
					Add
				</Button>
			)}
		</>
	);
};

export default TransactionCreate;
