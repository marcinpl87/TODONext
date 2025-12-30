'use client';

import React, {
	forwardRef,
	useImperativeHandle,
	useEffect,
	useCallback,
	useRef,
} from 'react';

type TodoTimerRef =
	| HTMLDivElement
	| {
			onClickStart: () => void;
			onClickPause: () => void;
			onClickStop: () => void;
	  };

type TodoTimerProps = {
	intervalRef: React.MutableRefObject<NodeJS.Timeout | null>;
	getDeadTime: (seconds: number) => Date;
	getTimeRemaining: (e: Date) => Record<string, number>;
	getTimeRemainingToTimerString: (e: Date) => string;
	timer: string;
	setTimer: React.Dispatch<React.SetStateAction<string>>;
	sec: number;
	toggleDone: () => void;
	todoTitle: string;
	autoStart?: boolean;
	disableConfirm?: boolean;
};

const TodoTimer = forwardRef<TodoTimerRef, TodoTimerProps>(
	(
		{
			intervalRef,
			getDeadTime,
			getTimeRemaining,
			getTimeRemainingToTimerString,
			timer,
			setTimer,
			sec,
			toggleDone,
			todoTitle,
			autoStart = false,
			disableConfirm = false,
		},
		ref,
	) => {
		const getTimerStringToSeconds = useCallback((timeString: string) => {
			const parts = timeString.split(':');
			const hours = parseInt(parts[0], 10);
			const minutes = parseInt(parts[1], 10);
			const seconds = parseInt(parts[2], 10);
			return hours * 3600 + minutes * 60 + seconds;
		}, []);

		const onClickStop = useCallback(() => {
			if (intervalRef.current) {
				clearInterval(intervalRef.current);
			}
			intervalRef.current = null;
			setTimer(getTimeRemainingToTimerString(getDeadTime(sec)));
		}, [
			intervalRef,
			setTimer,
			getTimeRemainingToTimerString,
			getDeadTime,
			sec,
		]);

		const startTimer = useCallback(
			(e: Date) => {
				const { total } = getTimeRemaining(e);
				if (total >= 0) {
					// update the timer
					setTimer(getTimeRemainingToTimerString(e));
				} else {
					if (disableConfirm) {
						onClickStop();
					} else {
						if (
							confirm(
								`Time is over! Would you like to mark TODO "${todoTitle}" as done?`,
							)
						) {
							onClickStop();
							toggleDone();
						} else {
							onClickStop();
						}
					}
				}
			},
			[
				getTimeRemaining,
				setTimer,
				getTimeRemainingToTimerString,
				todoTitle,
				toggleDone,
				onClickStop,
				disableConfirm,
			],
		);

		const onClickStart = useCallback(() => {
			const timerDateTime = getDeadTime(
				(timer === getTimeRemainingToTimerString(getDeadTime(sec))
					? sec // if timer is not started yet (not un-paused), then use default amount of seconds
					: getTimerStringToSeconds(timer)) - 1, // -1 because we want to see timer starts immediately after click on a button
			);
			setTimer(getTimeRemainingToTimerString(timerDateTime)); // if remove this line the updating of timer Variable will be after 1000ms or 1sec
			if (intervalRef.current) {
				clearInterval(intervalRef.current);
			}
			const id = setInterval(() => {
				startTimer(timerDateTime);
			}, 1000);
			intervalRef.current = id;
		}, [
			timer,
			getDeadTime,
			getTimeRemainingToTimerString,
			sec,
			setTimer,
			intervalRef,
			getTimerStringToSeconds,
			startTimer,
		]);

		const hasAutoStarted = useRef(false);

		const onClickPause = () => {
			if (intervalRef.current) {
				clearInterval(intervalRef.current);
			}
			intervalRef.current = null;
		};

		useImperativeHandle(ref, () => ({
			onClickStart,
			onClickPause,
			onClickStop,
		}));

		// Auto-start timer when component mounts if autoStart is true
		useEffect(() => {
			if (autoStart && !hasAutoStarted.current) {
				hasAutoStarted.current = true;
				onClickStart();
			}
		}, [autoStart, onClickStart]);

		return <>{timer}</>;
	},
);

export default TodoTimer;
