'use client';

import React from 'react';
import { Card } from './ui/card';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from './ui/table';
import type { Budget, Category } from '../types';

type BudgetTableProps = {
	budget: Budget[];
	categories: Category[];
};

const BudgetTable: React.FC<BudgetTableProps> = ({ budget, categories }) => {
	// Early return if budget is empty
	if (!budget || budget.length === 0) {
		return (
			<Card className="w-full max-w-4xl mb-5">
				<div className="p-4 text-center text-gray-500">
					No budget data available
				</div>
			</Card>
		);
	}

	// Get all column keys (months) from the first budget item
	const allKeys = Object.keys(budget[0]);

	// Filter out month columns where all categories have zero values
	const keysToKeep = allKeys.filter(key => {
		// Always keep the first column (category identifier)
		if (key === allKeys[0]) {
			return true;
		}

		// For other columns (months), check if at least one category has a non-zero value
		return budget.some(item => Number(item[key]) !== 0);
	});

	// Create filtered budget with only the columns we want to keep
	const filteredBudget = budget.map(item => {
		const filteredItem: Budget = {} as Budget;
		keysToKeep.forEach(key => {
			filteredItem[key] = item[key];
		});
		return filteredItem;
	});

	// If only the category column is left, show no data message
	if (keysToKeep.length <= 1) {
		return (
			<Card className="w-full max-w-4xl mb-5">
				<div className="p-4 text-center text-gray-500">
					No budget data to display
				</div>
			</Card>
		);
	}

	return (
		<Card className="w-full max-w-4xl mb-5">
			<Table>
				<TableHeader>
					<TableRow>
						{Object.keys(filteredBudget[0]).map(key => (
							<TableHead key={key} className="capitalize">
								{key}
							</TableHead>
						))}
					</TableRow>
				</TableHeader>
				<TableBody>
					{filteredBudget.map((item, index) => (
						<TableRow key={index}>
							{Object.entries(item).map(
								([key, value], cellIndex) => (
									<TableCell
										key={cellIndex}
										className="py-2 capitalize"
									>
										{key === Object.keys(item)[0]
											? categories.find(
													cat => cat.id === value,
												)?.name || value
											: Math.round(Number(value))}
									</TableCell>
								),
							)}
						</TableRow>
					))}
					{/* Total row */}
					<TableRow className="font-bold border-t-2">
						{Object.keys(filteredBudget[0]).map((key, index) => (
							<TableCell key={index} className="py-2">
								{index === 0
									? 'Total'
									: Math.round(
											filteredBudget.reduce(
												(sum, item) =>
													sum + Number(item[key]),
												0,
											),
										)}
							</TableCell>
						))}
					</TableRow>
				</TableBody>
			</Table>
		</Card>
	);
};

export default BudgetTable;
