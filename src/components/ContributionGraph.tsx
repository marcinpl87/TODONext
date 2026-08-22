'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '../utils';

const CELL = 11;
const GAP = 3;
const MONTHS = [
	'Jan',
	'Feb',
	'Mar',
	'Apr',
	'May',
	'Jun',
	'Jul',
	'Aug',
	'Sep',
	'Oct',
	'Nov',
	'Dec',
];
const DAY_LABELS = ['', 'Mon', '', 'Wed', '', 'Fri', ''];

/** GitHub profile contribution colors, light then dark. */
const LEVEL_CLASS = [
	'bg-[#ebedf0] dark:bg-[#161b22]',
	'bg-[#9be9a8] dark:bg-[#0e4429]',
	'bg-[#40c463] dark:bg-[#006d32]',
	'bg-[#30a14e] dark:bg-[#26a641]',
	'bg-[#216e39] dark:bg-[#39d353]',
] as const;

interface ContributionDay {
	date: Date;
	count: number;
}

interface ContributionWeek {
	days: (ContributionDay | null)[];
}

interface TooltipState {
	day: ContributionDay;
	x: number;
	y: number;
}

interface ContributionGraphProps {
	/**
	 * Counts keyed by local date `YYYY-MM-DD`. Days not listed are zero.
	 * Omit to fill the year with stable sample activity.
	 */
	counts?: Record<string, number>;
}

const dateKey = (date: Date): string => {
	const month = String(date.getMonth() + 1).padStart(2, '0');
	const day = String(date.getDate()).padStart(2, '0');
	return `${date.getFullYear()}-${month}-${day}`;
};

const startOfDay = (date: Date): Date =>
	new Date(date.getFullYear(), date.getMonth(), date.getDate());

const addDays = (date: Date, amount: number): Date =>
	new Date(date.getFullYear(), date.getMonth(), date.getDate() + amount);

const unitRandom = (seed: string): number => {
	let hash = 2166136261;
	for (let i = 0; i < seed.length; i++) {
		hash ^= seed.charCodeAt(i);
		hash = Math.imul(hash, 16777619);
	}
	hash = Math.imul(hash ^ (hash >>> 15), 2246822507);
	hash = Math.imul(hash ^ (hash >>> 13), 3266489909);
	return ((hash ^ (hash >>> 16)) >>> 0) / 4294967296;
};

const dayOfYear = (date: Date): number =>
	Math.floor(
		(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) -
			Date.UTC(date.getFullYear(), 0, 0)) /
			86400000,
	);

/** Stable, skewed sample so the grid looks like a real year of activity. */
const sampleCount = (date: Date): number => {
	const key = dateKey(date);
	const roll = unitRandom(key);
	const amount = unitRandom(`${key}:n`);
	const weekend = date.getDay() === 0 || date.getDay() === 6;
	const weekRoll = unitRandom(
		`${date.getFullYear()}-w${Math.floor(dayOfYear(date) / 7)}`,
	);

	if (weekRoll < 0.14) {
		return roll < 0.88 ? 0 : 1;
	}
	if ((weekend && roll < 0.7) || (!weekend && roll < 0.3)) {
		return 0;
	}

	const busy = weekRoll > 0.8;
	let cap = 12;
	if (busy && weekend) {
		cap = 8;
	} else if (busy) {
		cap = 22;
	} else if (weekend) {
		cap = 5;
	}
	const skew = busy ? 1.05 : 1.75;
	return 1 + Math.floor(Math.pow(amount, skew) * cap);
};

const levelFor = (count: number): number => {
	if (count <= 0) {
		return 0;
	}
	if (count < 4) {
		return 1;
	}
	if (count < 8) {
		return 2;
	}
	if (count < 12) {
		return 3;
	}
	return 4;
};

const ordinal = (day: number): string => {
	const mod100 = day % 100;
	if (mod100 >= 11 && mod100 <= 13) {
		return `${day}th`;
	}
	switch (day % 10) {
		case 1:
			return `${day}st`;
		case 2:
			return `${day}nd`;
		case 3:
			return `${day}rd`;
		default:
			return `${day}th`;
	}
};

const formatDay = (date: Date): string => {
	const month = date.toLocaleDateString('en-US', { month: 'long' });
	return `${month} ${ordinal(date.getDate())}, ${date.getFullYear()}`;
};

const buildWeeks = (
	end: Date,
	counts: Record<string, number> | null,
): ContributionWeek[] => {
	const endDay = startOfDay(end);
	const rangeStart = addDays(endDay, -364);
	let cursor = addDays(rangeStart, -rangeStart.getDay());
	const weeks: ContributionWeek[] = [];

	while (cursor.getTime() <= endDay.getTime()) {
		const days: (ContributionDay | null)[] = [];
		for (let i = 0; i < 7; i++) {
			if (cursor.getTime() > endDay.getTime()) {
				days.push(null);
			} else {
				const key = dateKey(cursor);
				days.push({
					date: new Date(cursor),
					count: counts ? (counts[key] ?? 0) : sampleCount(cursor),
				});
			}
			cursor = addDays(cursor, 1);
		}
		weeks.push({ days });
	}

	return weeks;
};

/** Hide a month name when the next one would sit on top of it. */
const monthLabelAt = (weeks: ContributionWeek[]): Map<number, string> => {
	const raw: { index: number; text: string }[] = [];
	const first = weeks[0]?.days.find(
		(day): day is ContributionDay => day !== null,
	);
	if (first && first.date.getDate() !== 1) {
		raw.push({ index: 0, text: MONTHS[first.date.getMonth()] });
	}
	weeks.forEach((week, index) => {
		const firstOfMonth = week.days.find(
			day => day && day.date.getDate() === 1,
		);
		if (firstOfMonth) {
			raw.push({
				index,
				text: MONTHS[firstOfMonth.date.getMonth()],
			});
		}
	});

	const labels = new Map<number, string>();
	raw.forEach((label, index) => {
		const next = raw[index + 1];
		if (next && next.index - label.index < 3) {
			return;
		}
		labels.set(label.index, label.text);
	});
	return labels;
};

const ContributionTooltip: React.FC<{ tooltip: TooltipState }> = ({
	tooltip,
}) => {
	const { day } = tooltip;
	const below = tooltip.y < 48;
	const margin = Math.min(160, Math.max(8, window.innerWidth / 2 - 8));
	const left = Math.min(
		window.innerWidth - margin,
		Math.max(margin, tooltip.x),
	);
	const summary =
		day.count === 0
			? 'No contributions'
			: day.count === 1
				? '1 contribution'
				: `${day.count.toLocaleString('en-US')} contributions`;

	return createPortal(
		<div
			role="tooltip"
			className="pointer-events-none fixed z-50 whitespace-nowrap rounded-md bg-[#24292f] px-2.5 py-1.5 text-xs text-white shadow-lg"
			style={{
				left,
				top: below ? tooltip.y + CELL + 10 : tooltip.y - 8,
				transform: below
					? 'translate(-50%, 0)'
					: 'translate(-50%, -100%)',
			}}
		>
			<span className="font-semibold">{summary}</span>
			{` on ${formatDay(day.date)}`}
			<span
				className={cn(
					'absolute left-1/2 size-2 -translate-x-1/2 rotate-45 bg-[#24292f]',
					below ? '-top-1' : '-bottom-1',
				)}
			/>
		</div>,
		document.body,
	);
};

const ContributionGraph: React.FC<ContributionGraphProps> = ({ counts }) => {
	const [today, setToday] = useState<Date | null>(null);
	const [tooltip, setTooltip] = useState<TooltipState | null>(null);

	useEffect(() => {
		setToday(startOfDay(new Date()));
	}, []);

	const weeks = useMemo(
		() => (today ? buildWeeks(today, counts ?? null) : []),
		[today, counts],
	);
	const labels = useMemo(() => monthLabelAt(weeks), [weeks]);
	const total = useMemo(
		() =>
			weeks.reduce(
				(sum, week) =>
					sum +
					week.days.reduce(
						(inner, day) => inner + (day?.count ?? 0),
						0,
					),
				0,
			),
		[weeks],
	);

	useEffect(() => {
		if (!tooltip) {
			return undefined;
		}
		const hide = () => setTooltip(null);
		window.addEventListener('scroll', hide, true);
		window.addEventListener('resize', hide);
		return () => {
			window.removeEventListener('scroll', hide, true);
			window.removeEventListener('resize', hide);
		};
	}, [tooltip]);

	const showTooltip = (element: HTMLElement, day: ContributionDay) => {
		const rect = element.getBoundingClientRect();
		setTooltip({
			day,
			x: rect.left + rect.width / 2,
			y: rect.top,
		});
	};

	if (!today) {
		return (
			<div className="animate-pulse" aria-hidden>
				<div className="mb-3 h-4 w-56 rounded bg-muted" />
				<div className="h-[132px] w-full rounded bg-muted/70" />
			</div>
		);
	}

	const columns = `repeat(${weeks.length}, ${CELL}px)`;

	return (
		<div className="select-none">
			<p className="mb-3 text-sm">
				<span className="font-semibold">
					{total.toLocaleString('en-US')}
				</span>{' '}
				contributions in the last year
			</p>
			<div className="overflow-x-auto pb-1">
				<div className="w-max pr-6">
					<div className="flex">
						<div className="w-8 shrink-0" />
						<div
							aria-hidden
							className="grid h-5 text-[11px] leading-5 text-muted-foreground"
							style={{
								gridTemplateColumns: columns,
								columnGap: GAP,
							}}
						>
							{weeks.map((_, index) => (
								<div key={index} className="relative">
									{labels.get(index) && (
										<span className="absolute left-0 whitespace-nowrap">
											{labels.get(index)}
										</span>
									)}
								</div>
							))}
						</div>
					</div>
					<div className="flex">
						<div
							aria-hidden
							className="grid w-8 shrink-0 pr-1.5 text-right text-[11px] leading-[11px] text-muted-foreground"
							style={{
								gridTemplateRows: `repeat(7, ${CELL}px)`,
								rowGap: GAP,
							}}
						>
							{DAY_LABELS.map((label, index) => (
								<div
									key={index}
									className="flex items-center justify-end"
								>
									{label}
								</div>
							))}
						</div>
						<div
							role="grid"
							aria-label="Contributions in the last year"
							className="grid"
							style={{
								gridTemplateColumns: columns,
								gridTemplateRows: `repeat(7, ${CELL}px)`,
								gap: GAP,
								gridAutoFlow: 'column',
							}}
						>
							{weeks.flatMap((week, weekIndex) =>
								week.days.map((day, dayIndex) => {
									if (!day) {
										return (
											<div
												key={`empty-${weekIndex}-${dayIndex}`}
												className="size-[11px]"
											/>
										);
									}
									const level = levelFor(day.count);
									const label =
										day.count === 0
											? `No contributions on ${formatDay(day.date)}`
											: `${day.count} contribution${day.count === 1 ? '' : 's'} on ${formatDay(day.date)}`;
									return (
										<button
											key={dateKey(day.date)}
											type="button"
											role="gridcell"
											aria-label={label}
											className={cn(
												'block size-[11px] rounded-[2px] border-0 p-0 outline-none',
												'hover:outline hover:outline-1 hover:outline-offset-1 hover:outline-foreground/60',
												'focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-1 focus-visible:outline-foreground',
												LEVEL_CLASS[level],
											)}
											onMouseEnter={event =>
												showTooltip(
													event.currentTarget,
													day,
												)
											}
											onMouseLeave={() =>
												setTooltip(null)
											}
											onFocus={event =>
												showTooltip(
													event.currentTarget,
													day,
												)
											}
											onBlur={() => setTooltip(null)}
										/>
									);
								}),
							)}
						</div>
					</div>
					<div className="mt-2 flex items-center justify-end gap-[3px] text-[11px] text-muted-foreground">
						<span className="mr-0.5">Less</span>
						{LEVEL_CLASS.map(levelClass => (
							<span
								key={levelClass}
								aria-hidden
								className={cn(
									'size-[11px] rounded-[2px]',
									levelClass,
								)}
							/>
						))}
						<span className="ml-0.5">More</span>
					</div>
				</div>
			</div>
			{tooltip && <ContributionTooltip tooltip={tooltip} />}
		</div>
	);
};

export default ContributionGraph;
