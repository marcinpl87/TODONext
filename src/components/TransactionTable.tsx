'use client';

import React from 'react';
import { Card } from './ui/card';
import { Table, TableBody, TableHead, TableHeader, TableRow } from './ui/table';
import type {
	Category,
	Transaction,
	TransactionDelete,
	TransactionEdit,
} from '../types/financial';
import TransactionTableRow from './TransactionTableRow';

type TransactionTableProps = {
	transactions: Transaction[];
	categories: Category[];
	editTransaction: TransactionEdit;
	deleteTransaction: TransactionDelete;
};

const TransactionTable: React.FC<TransactionTableProps> = ({
	transactions,
	categories,
	editTransaction,
	deleteTransaction,
}) => (
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
					.sort((a, b) => b.creationTimestamp - a.creationTimestamp) // sort by creation time desc for new transactions added in frontend
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

export default TransactionTable;
