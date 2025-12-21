'use client';

import React from 'react';
import { Card } from './ui/card';
import { Table, TableBody, TableHead, TableHeader, TableRow } from './ui/table';
import { useLogin } from '../hooks';
import type {
	Category,
	Transaction,
	TransactionDelete,
	TransactionEdit,
} from '../types';
import TransactionTableRow from './TransactionTableRow';

type TransactionTableProps = {
	transactions: Transaction[];
	categories: Category[];
};

const TransactionTable: React.FC<TransactionTableProps> = ({
	transactions,
	categories,
}) => {
	const login = useLogin();

	const editTransaction: TransactionEdit = (id, name, value) => {
		fetch(`/api/transaction/${id}`, {
			method: 'PATCH',
			headers: {
				Authorization: `Bearer ${localStorage.getItem('authToken')}`,
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				userId: login.userId,
				transaction: {
					[name]: value,
				},
			}),
		});
	};

	const deleteTransaction: TransactionDelete = id => {
		fetch(`/api/transaction/${id}`, {
			method: 'DELETE',
			headers: {
				Authorization: `Bearer ${localStorage.getItem('authToken')}`,
				'Content-Type': 'application/json',
			},
		});
	};

	return (
		<Card className="w-full max-w-4xl mb-5">
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead className="min-w-[120px]">Date</TableHead>
						<TableHead>Amount</TableHead>
						<TableHead>Receiver</TableHead>
						<TableHead>Description</TableHead>
						<TableHead>Category</TableHead>
						{/* empty header for action buttons */}
						<TableHead></TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{transactions
						.sort(
							(a, b) => b.creationTimestamp - a.creationTimestamp,
						) // sort by creation time desc for new transactions added in frontend
						.map((transaction: Transaction) => (
							<TransactionTableRow
								key={transaction.id}
								transaction={transaction}
								categories={categories}
								editAndSaveTransaction={editTransaction}
								deleteTransaction={deleteTransaction}
							/>
						))}
				</TableBody>
			</Table>
		</Card>
	);
};

export default TransactionTable;
