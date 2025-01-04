'use client';

import React, { Dispatch, SetStateAction } from 'react';
import { Input } from './ui/input';
import { Label } from './ui/label';

const DynamicInputsList: React.FC<{
	label: string;
	inputs: string[];
	setInputs: Dispatch<SetStateAction<string[]>>;
}> = ({ label, inputs, setInputs }) => {
	const handleChange = (index: number, value: string) => {
		setInputs(prevInputs => {
			let newInputs = [...prevInputs];
			newInputs[index] = value;
			newInputs = newInputs.filter(
				(item, i) => item.trim() !== '' || i === newInputs.length - 1,
			); // filter out empty items except the last one
			if (newInputs[newInputs.length - 1] !== '') {
				newInputs.push('');
			} // ensure there is always an empty input at the end
			return newInputs;
		});
	};

	return (
		<>
			<Label>{label}</Label>
			{inputs.map((input, index) => (
				<Input
					key={index}
					type="text"
					value={input}
					onChange={e => handleChange(index, e.target.value)}
				/>
			))}
		</>
	);
};

export default DynamicInputsList;
