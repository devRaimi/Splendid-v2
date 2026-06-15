export const formatWithCommas = (num) => {
	if (!num && num !== 0) return '';
	return new Intl.NumberFormat('en-US').format(num);
};

export const handleChange = (e, state) => {
	const inputValue = e.target.value;
	const cleanNumberString = inputValue.replace(/\D/g, '');
	state(cleanNumberString === '' ? 0 : Number(cleanNumberString));
};

export const handleChange2 = (e) => {
	const inputValue = e.target.value;
	const cleanNumberString = inputValue.replace(/\D/g, '');
	return cleanNumberString
};