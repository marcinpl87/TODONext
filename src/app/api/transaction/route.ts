import { sql } from '@vercel/postgres';
import { Transaction } from '../../../types/financial';
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
	// Pivot table query for expenses by category and month-year
	// This query creates a budget-style summary showing spending per category per month-year
	// First, get all available month-year combinations
	const monthYearData = await sql`
		SELECT DISTINCT 
			TRIM(TO_CHAR("date", 'month-YYYY')) AS month_year_key,
			TO_DATE(TRIM(TO_CHAR("date", 'month-YYYY')), 'month-YYYY') AS sort_date
		FROM bank_transaction 
		WHERE "isHidden" = FALSE 
			AND COALESCE("amountCustom", "amount") < 0
		ORDER BY sort_date DESC
	`;

	const monthYearColumns = monthYearData.rows.map(row => row.month_year_key);

	// Build dynamic pivot query
	const pivotColumns = monthYearColumns
		.map(
			monthYear =>
				`COALESCE(SUM(CASE WHEN TRIM(TO_CHAR(me."date", 'month-YYYY')) = '${monthYear}' THEN me.expense_amount END), 0) AS "${monthYear}"`,
		)
		.join(',\n\t\t\t');

	// Construct the full query as a string
	const pivotQueryString = `
		WITH monthly_expenses AS (
			SELECT 
				"categoryId",
				CASE 
					WHEN "categoryId" IS NULL THEN 'Uncategorized'
					ELSE "categoryId"::text
				END AS category_display,
				"date",
				ABS(COALESCE("amountCustom", "amount")) AS expense_amount
			FROM bank_transaction 
			WHERE "isHidden" = FALSE 
				AND COALESCE("amountCustom", "amount") < 0
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
			${pivotColumns},
			ct.total_spending AS total
		FROM category_totals ct
		LEFT JOIN monthly_expenses me ON ct.category_display = me.category_display
		GROUP BY ct.category_display, ct.total_spending
		ORDER BY ct.total_spending DESC;
	`;

	const pivotData = await sql.query(pivotQueryString);

	return NextResponse.json(
		{
			data: data.rows,
			budgetData: pivotData.rows,
		},
		{ status: 200 },
	);
};
