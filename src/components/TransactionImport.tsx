'use client';

import React from 'react';
import { Button } from './ui/button';
import { Card, CardHeader } from './ui/card';
import LoadingIcon from './LoadingIcon';

type TransactionImportProps = {
	errors: string;
	isLoading: boolean;
	importBankData: () => void;
};

const TransactionImport: React.FC<TransactionImportProps> = ({
	errors,
	isLoading,
	importBankData,
}) => (
	<>
		{errors ? (
			<Card className="w-full max-w-4xl mb-5">
				<CardHeader>
					<p className="text-sm text-red-500">{errors}</p>
				</CardHeader>
			</Card>
		) : (
			<Button className="mb-5" variant="outline" onClick={importBankData}>
				{isLoading ? <LoadingIcon className="scale-50" /> : 'Import'}
			</Button>
		)}
	</>
);

export default TransactionImport;
