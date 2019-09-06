export const thousand = (num) => {
    if(typeof num !== 'string')
    { num = num.toString(); }
    return num.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export const padNumber = (num, length = 2) => {
    if(typeof num !== 'string')
    { num = num.toString(); }
	if(num.length === length){
		return num;
	}
	for (var i = length.length - 1; i >= 0; i--) {
		num = `0${num}`;
	}
	return num;
}

export const percentage = (value, total) => {
	return ((value/total) * 100 || 0).toFixed(1);
}