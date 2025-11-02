'use client';

import React from 'react';
import { DateTime } from 'luxon';
import { MoreHorizontal } from 'lucide-react';
import { cn } from '../utils';
import { TableCell, TableRow } from './ui/table';
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from './ui/select';
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from './ui/tooltip';
import { Button } from './ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from './ui/dropdown-menu';
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from './ui/alert-dialog';
import { DATE_FORMAT, MILISECONDS_FORMAT } from '../consts';
import type {
	Category,
	Transaction,
	TransactionDelete,
	TransactionEdit,
} from '../types';

const WORD_LENGTH_LIMIT = 20;

type TransactionTableRowProps = {
	transaction: Transaction;
	categories: Category[];
	editAndSaveTransaction: TransactionEdit;
	deleteTransaction: TransactionDelete;
};

const TransactionTableRow: React.FC<TransactionTableRowProps> = ({
	transaction,
	categories,
	editAndSaveTransaction,
	deleteTransaction,
}) => {
	const [transactionState, setTransactionState] =
		React.useState<Transaction>(transaction);
	const [deleteDialogOpen, setDeleteDialogOpen] =
		React.useState<boolean>(false);
	const [dropdownOpen, setDropdownOpen] = React.useState<boolean>(false);
	const amount = transactionState.amountCustom || transactionState.amount;
	const description =
		transactionState.descriptionCustom || transactionState.description;

	const editTransaction = (name: keyof Transaction, value: any): void => {
		setTransactionState(prev => ({
			...prev,
			[name]: value,
		}));
		editAndSaveTransaction(transactionState.id, name, value);
	};

	const handleDelete = (): void => {
		setTransactionState(prev => ({
			...prev,
			isHidden: true,
		})); // optimistically hide row in frontend
		deleteTransaction(transactionState.id);
		setDeleteDialogOpen(false);
	};

	const handleCancel = (): void => {
		setDeleteDialogOpen(false);
	};

	const getBreakWordOrAll = (text: string): string => {
		const words = text.split(/[\s\n]+/);
		let isVeryLongWord = false;
		words.forEach(word => {
			if (word.length > WORD_LENGTH_LIMIT) {
				isVeryLongWord = true;
			}
		});
		return text.includes(' ') && !isVeryLongWord
			? 'break-words'
			: 'break-all';
	};

	if (transactionState.isHidden) {
		return null;
	} // hide row for transactions dynamically hidden in frontend

	return (
		<>
			<TableRow>
				<TableCell className="py-2">
					<TooltipProvider>
						<Tooltip>
							<TooltipTrigger asChild>
								<Button
									variant="ghost"
									className="p-0 hover:bg-transparent"
								>
									{DateTime.fromMillis(
										Number(transactionState.date),
									).toFormat(DATE_FORMAT)}
								</Button>
							</TooltipTrigger>
							<TooltipContent>
								<p>
									{DateTime.fromMillis(
										Number(
											transactionState.creationTimestamp,
										),
									).toFormat(MILISECONDS_FORMAT)}
								</p>
							</TooltipContent>
						</Tooltip>
					</TooltipProvider>
				</TableCell>
				<TableCell className="py-2">{amount}</TableCell>
				<TableCell
					className={cn(
						'py-2',
						getBreakWordOrAll(transactionState.receiver),
					)}
				>
					{transactionState.receiver}
				</TableCell>
				<TableCell
					className={cn('py-2', getBreakWordOrAll(description))}
				>
					{description}
				</TableCell>
				<TableCell className="py-0">
					{transactionState.categoryId ? (
						<span className="capitalize">
							{categories.find(
								cat => cat.id === transactionState.categoryId,
							)?.name || 'Not found'}
						</span>
					) : (
						<>
							{categories && categories.length > 0 && (
								<Select
									onValueChange={catId =>
										editTransaction('categoryId', catId)
									}
								>
									<SelectTrigger className="py-0 h-8 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0">
										<SelectValue placeholder="..." />
									</SelectTrigger>
									<SelectContent className="max-h-max">
										<SelectGroup>
											{categories.map(cat => (
												<SelectItem
													key={cat.id}
													value={cat.id}
													className="pl-2 capitalize"
												>
													{cat.name}
												</SelectItem>
											))}
										</SelectGroup>
									</SelectContent>
								</Select>
							)}
						</>
					)}
				</TableCell>
				<TableCell className="py-0">
					<DropdownMenu
						open={dropdownOpen}
						onOpenChange={setDropdownOpen}
					>
						<DropdownMenuTrigger asChild>
							<Button variant="ghost" className="h-8 w-8 p-0">
								<span className="sr-only">Open menu</span>
								<MoreHorizontal />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							<DropdownMenuItem
								onClick={() => {
									editTransaction('isHidden', true);
									setDropdownOpen(false);
								}}
							>
								Hide
							</DropdownMenuItem>
							<DropdownMenuItem
								variant="destructive"
								onSelect={e => {
									e.preventDefault();
									setDropdownOpen(false);
									setTimeout(() => {
										setDeleteDialogOpen(true);
									}, 0); // delay to ensure dropdown closes before dialog opens
								}}
							>
								Delete
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</TableCell>
			</TableRow>
			<AlertDialog
				open={deleteDialogOpen}
				onOpenChange={setDeleteDialogOpen}
			>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>
							Are you absolutely sure?
						</AlertDialogTitle>
						<AlertDialogDescription>
							This will permanently delete the {amount},{' '}
							{transactionState.receiver}, {description}{' '}
							transaction.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel onClick={handleCancel}>
							Cancel
						</AlertDialogCancel>
						<AlertDialogAction onClick={handleDelete}>
							Delete
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	);
};

export default TransactionTableRow;
