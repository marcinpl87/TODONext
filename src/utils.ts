import {
	JetBrains_Mono as FontMono,
	Inter as FontSans,
} from 'next/font/google';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const fontSans = FontSans({
	subsets: ['latin'],
	variable: '--font-sans',
});

export const fontMono = FontMono({
	subsets: ['latin'],
	variable: '--font-mono',
});

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));
