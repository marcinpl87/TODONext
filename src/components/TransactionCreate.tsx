'use client';

import React, { useState, FormEvent } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useLogin } from '../hooks';
import { Card } from './ui/card';
import TransactionForm from './TransactionForm';
import type { Transaction } from '../types';

type TransactionCreateProps = {
	addTransaction: (transaction: Transaction, callback: () => void) => void;
};

const TransactionCreate: React.FC<TransactionCreateProps> = ({
	addTransaction,
}) => {
	const login = useLogin();
	const [description, setDescription] = useState<string>('');

	const handleSubmit = (e: FormEvent) => {
		e.preventDefault();
		addTransaction(
			{
				id: uuidv4(),
				userId: login.userId,
				description,
				creationTimestamp: Date.now(),
			},
			() => {
				setDescription('');
			},
		);
	};

	return (
		<Card className="w-full max-w-4xl mb-5">
			<TransactionForm
				header="New Transaction"
				description={description}
				setDescription={setDescription}
				handleCancel={() => {}}
				handleSubmit={handleSubmit}
			/>
		</Card>
	);
};

export default TransactionCreate;
