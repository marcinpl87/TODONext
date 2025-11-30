import { sql } from '@vercel/postgres';
import { Transaction } from '../../../types';
import { type NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '../../../lib/auth';
import { timezonedDateToUTC } from './utils';

export const POST = async (request: NextRequest) => {
	const authResult = requireAuth(request);
	if (authResult.error) {
		return NextResponse.json(
			{ message: authResult.error },
			{ status: 401 },
		);
	}

	const data: { userId: string; transaction: Transaction } =
		await request.json();

	if (data.userId !== authResult.user?.userId) {
		return NextResponse.json(
			{
				message:
					'Forbidden: Cannot create transactions for other users',
			},
			{ status: 403 },
		);
	}

	if (data && data.userId && data.transaction) {
		await sql.query(
			`INSERT INTO bank_transaction (
				"id",
				"userId",
				"creationTimestamp",
				"date",
				"amountCustom",
				"receiver",
				"descriptionCustom",
				"isManual"
			)
			VALUES ($1, $2, to_timestamp($3), to_timestamp($4), $5, $6, $7, $8);`,
			[
				data.transaction.id,
				data.userId,
				data.transaction.creationTimestamp
					? data.transaction.creationTimestamp / 1000
					: 0,
				data.transaction.date
					? new Date(
							timezonedDateToUTC(data.transaction.date),
						).getTime() / 1000
					: 0, // convert timezoned date to UTC (GMT) timestamp
				data.transaction.amount,
				data.transaction.receiver,
				data.transaction.description,
				data.transaction.isManual,
			],
		);
	}
	return NextResponse.json({ message: 'OK' }, { status: 200 });
};

export const GET = async (request: NextRequest) => {
	// Check authentication
	const authResult = requireAuth(request);
	if (authResult.error) {
		return NextResponse.json(
			{ message: authResult.error },
			{ status: 401 },
		);
	}
	const data = await sql`
		SELECT
			"id",
			"userId",
			(EXTRACT(EPOCH FROM "date") * 1000)::BIGINT AS "date",
			"amount",
			"amountCustom",
			"receiver",
			"description",
			"descriptionCustom",
			"categoryId",
			"isManual",
			"isHidden",
			(EXTRACT(EPOCH FROM "creationTimestamp") * 1000)::BIGINT AS "creationTimestamp"
		FROM bank_transaction
		WHERE "isHidden" = FALSE
		ORDER BY "creationTimestamp" DESC;
	`;
	// Pivot table query for expenses by category and month
	// This query creates a budget-style summary showing spending per category per month
	const pivotData = await sql`
		WITH monthly_expenses AS (
			SELECT 
				"categoryId",
				CASE 
					WHEN "categoryId" IS NULL THEN 'Uncategorized'
					ELSE "categoryId"::text
				END AS category_display,
				DATE_TRUNC('month', "date") AS month,
				ABS(COALESCE("amountCustom", "amount")) AS expense_amount
			FROM bank_transaction 
			WHERE "isHidden" = FALSE 
				AND COALESCE("amountCustom", "amount") < 0  -- Only expenses (negative amounts)
				AND "date" >= DATE_TRUNC('year', CURRENT_DATE)  -- Current year only
		),
		category_totals AS (
			SELECT 
				category_display,
				SUM(expense_amount) AS total_spending
			FROM monthly_expenses
			GROUP BY category_display
		)
		SELECT 
			ct.category_display AS category,
			COALESCE(SUM(CASE WHEN EXTRACT(MONTH FROM me.month) = 1 THEN me.expense_amount END), 0) AS january,
			COALESCE(SUM(CASE WHEN EXTRACT(MONTH FROM me.month) = 2 THEN me.expense_amount END), 0) AS february,
			COALESCE(SUM(CASE WHEN EXTRACT(MONTH FROM me.month) = 3 THEN me.expense_amount END), 0) AS march,
			COALESCE(SUM(CASE WHEN EXTRACT(MONTH FROM me.month) = 4 THEN me.expense_amount END), 0) AS april,
			COALESCE(SUM(CASE WHEN EXTRACT(MONTH FROM me.month) = 5 THEN me.expense_amount END), 0) AS may,
			COALESCE(SUM(CASE WHEN EXTRACT(MONTH FROM me.month) = 6 THEN me.expense_amount END), 0) AS june,
			COALESCE(SUM(CASE WHEN EXTRACT(MONTH FROM me.month) = 7 THEN me.expense_amount END), 0) AS july,
			COALESCE(SUM(CASE WHEN EXTRACT(MONTH FROM me.month) = 8 THEN me.expense_amount END), 0) AS august,
			COALESCE(SUM(CASE WHEN EXTRACT(MONTH FROM me.month) = 9 THEN me.expense_amount END), 0) AS september,
			COALESCE(SUM(CASE WHEN EXTRACT(MONTH FROM me.month) = 10 THEN me.expense_amount END), 0) AS october,
			COALESCE(SUM(CASE WHEN EXTRACT(MONTH FROM me.month) = 11 THEN me.expense_amount END), 0) AS november,
			COALESCE(SUM(CASE WHEN EXTRACT(MONTH FROM me.month) = 12 THEN me.expense_amount END), 0) AS december,
			ct.total_spending AS total
		FROM category_totals ct
		LEFT JOIN monthly_expenses me ON ct.category_display = me.category_display
		GROUP BY ct.category_display, ct.total_spending
		ORDER BY ct.total_spending DESC;
	`;

	return NextResponse.json(
		{
			data: data.rows,
			budgetData: pivotData.rows,
		},
		{ status: 200 },
	);
};
