'use client';

import React, { useEffect } from 'react';
import { DateTime } from 'luxon';
import { Card } from './ui/card';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from './ui/table';
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from './ui/select';
import { useLogin } from '../hooks';
import { DATE_FORMAT } from '../consts';
import type { Transaction } from '../types';

type TransactionTableProps = {
	transactions: Transaction[];
	editTransaction: (id: string, categoryId: string) => void;
};

type Category = {
	id: string;
	name: string;
};

const TransactionTable: React.FC<TransactionTableProps> = ({
	transactions,
	editTransaction,
}) => {
	const login = useLogin();
	const [categories, setCategories] = React.useState<Category[]>([]);

	const editAndSaveTransaction = (id: string, categoryId: string): void => {
		editTransaction(id, categoryId);
		fetch('/api/transaction', {
			method: 'PATCH',
			headers: {
				Authorization: `Bearer ${localStorage.getItem('authToken')}`,
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				userId: login.userId,
				transaction: {
					id,
					categoryId,
				},
			}),
		});
	};

	useEffect(() => {
		fetch('/api/category', {
			method: 'GET',
			headers: {
				Authorization: `Bearer ${localStorage.getItem('authToken')}`,
				'Content-Type': 'application/json',
			},
		})
			.then(response => response.json())
			.then((data: { data: Category[] }) => {
				if (data?.data) {
					setCategories(data.data || []);
				}
			});
	}, []);

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
					</TableRow>
				</TableHeader>
				<TableBody>
					{transactions.map(transaction => (
						<TableRow key={transaction.id}>
							<TableCell>
								{DateTime.fromMillis(
									Number(transaction.date),
								).toFormat(DATE_FORMAT)}
							</TableCell>
							<TableCell>{transaction.amount}</TableCell>
							<TableCell>{transaction.receiver}</TableCell>
							<TableCell
								className={
									transaction.description.includes(' ')
										? 'break-words'
										: 'break-all'
								}
							>
								{transaction.description}
							</TableCell>
							<TableCell>
								{transaction.categoryId ? (
									<span className="capitalize">
										{categories.find(
											cat =>
												cat.id ===
												transaction.categoryId,
										)?.name || 'Not found'}
									</span>
								) : (
									<>
										{categories &&
											categories.length > 0 && (
												<Select
													onValueChange={catId =>
														editAndSaveTransaction(
															transaction.id,
															catId,
														)
													}
												>
													<SelectTrigger className="focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0">
														<SelectValue placeholder="..." />
													</SelectTrigger>
													<SelectContent className="max-h-max">
														<SelectGroup>
															{categories.map(
																cat => (
																	<SelectItem
																		key={
																			cat.id
																		}
																		value={
																			cat.id
																		}
																		className="pl-2 capitalize"
																	>
																		{
																			cat.name
																		}
																	</SelectItem>
																),
															)}
														</SelectGroup>
													</SelectContent>
												</Select>
											)}
									</>
								)}
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</Card>
	);
};

export default TransactionTable;
