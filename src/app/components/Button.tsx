'use client';

import React, { type ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {}

const Button: React.FC<ButtonProps> = ({ children, className, ...props }) => {
	const buttonClass =
		'bg-blue-500 min-w-[40px] text-white font-bold py-1 px-2 rounded focus:bg-blue-700 hover:bg-blue-700 focus:outline-none focus:shadow-outline disabled:bg-gray-400 disabled:cursor-not-allowed';

	return (
		<button className={`${buttonClass} ${className || ''}`} {...props}>
			{children}
		</button>
	);
};

export default Button;
