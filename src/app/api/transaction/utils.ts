export const timezonedDateToUTC = (date: Date) => {
	const localDate = new Date(date);
	const year = localDate.getFullYear();
	const month = localDate.getMonth();
	const day = localDate.getDate();
	return new Date(Date.UTC(year, month, day));
}; // convert a timezoned date to UTC (GMT) to store as a timezone-agnostic timestamp in the DB
