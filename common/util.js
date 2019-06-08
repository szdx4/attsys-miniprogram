function formatTime(time) {
	if (typeof time !== 'number' || time < 0) {
		return time
	}

	var hour = parseInt(time / 3600)
	time = time % 3600
	var minute = parseInt(time / 60)
	time = time % 60
	var second = time

	return ([hour, minute, second]).map(function (n) {
		n = n.toString()
		return n[1] ? n : '0' + n
	}).join(':')
}

function formatLocation(longitude, latitude) {
	if (typeof longitude === 'string' && typeof latitude === 'string') {
		longitude = parseFloat(longitude)
		latitude = parseFloat(latitude)
	}

	longitude = longitude.toFixed(2)
	latitude = latitude.toFixed(2)

	return {
		longitude: longitude.toString().split('.'),
		latitude: latitude.toString().split('.')
	}
}
var dateUtils = {
	UNITS: {
		'年': 31557600000,
		'月': 2629800000,
		'天': 86400000,
		'小时': 3600000,
		'分钟': 60000,
		'秒': 1000
	},
	humanize: function (milliseconds) {
		var humanize = '';
		for (var key in this.UNITS) {
			if (milliseconds >= this.UNITS[key]) {
				humanize = Math.floor(milliseconds / this.UNITS[key]) + key + '前';
				break;
			}
		}
		return humanize || '刚刚';
	},
	format: function (dateStr) {
		var date = this.parse(dateStr)
		var diff = Date.now() - date.getTime();
		if (diff < this.UNITS['天']) {
			return this.humanize(diff);
		}
		var _format = function (number) {
			return (number < 10 ? ('0' + number) : number);
		};
		return date.getFullYear() + '/' + _format(date.getMonth() + 1) + '/' + _format(date.getDay()) + '-' +
			_format(date.getHours()) + ':' + _format(date.getMinutes());
	},
	parse: function (str) { //将"yyyy-mm-dd HH:MM:ss"格式的字符串，转化为一个Date对象
		var a = str.split(/[^0-9]/);
		return new Date(a[0], a[1] - 1, a[2], a[3], a[4], a[5]);
	}
};
function forMatNum(num){
	return num<10?'0'+num:num+'';
}

function initDays(year,month){
	let totalDays=new Date(year,month,0).getDate();
	let dates=[];
	for(let d=1;d<=totalDays;d++){
		dates.push(forMatNum(d));
	};
	return dates;
}
function initPicker(start,end,mode="date",step) {
	let aToday=new Date();
	let tYear=aToday.getFullYear().toString();
	let tMonth=forMatNum(aToday.getMonth()+1).toString();
	let tDay=forMatNum(aToday.getDate()).toString();
	let tHours=forMatNum(aToday.getHours()).toString();
	let tMinutes=forMatNum(aToday.getMinutes()).toString();
	let tSeconds=forMatNum(aToday.getSeconds()).toString();
	let initstartDate=new Date(start);
	let endDate=new Date(end);
	if(start>end){
		initstartDate=new Date(end);
		endDate=new Date(start);
	};
	let startYear=initstartDate.getFullYear();
	let startMonth=initstartDate.getMonth();
	let endYear=endDate.getFullYear();
	let years=[],months=[],days=[],hours=[],minutes=[],seconds=[],defaultVal=[];
	let totalDays=new Date(startYear,startMonth,0).getDate();
	for(let s=startYear;s<=endYear;s++){
		years.push(s+'');
	};
	for(let m=1;m<=12;m++){
		months.push(forMatNum(m));
	};
	for(let d=1;d<=totalDays;d++){
		days.push(forMatNum(d));
	}
	for(let h=0;h<24;h++){
		hours.push(forMatNum(h));
	}
	for(let m=0;m<60;m+=step*1){
		minutes.push(forMatNum(m));
	}
	for(let s=0;s<60;s++){
		seconds.push(forMatNum(s));
	}
	switch(mode){
		case "date":
			defaultVal=[years.indexOf(tYear),months.indexOf(tMonth),days.indexOf(tDay)];
			return {years,months,days,defaultVal}
			break;
		case "yearMonth":
			defaultVal=[years.indexOf(tYear),months.indexOf(tMonth)];
			return {years,months,defaultVal}
			break;
		case "dateTime":
			defaultVal=[years.indexOf(tYear),months.indexOf(tMonth),days.indexOf(tDay),hours.indexOf(tHours),minutes.indexOf(tMinutes),seconds.indexOf(tSeconds)];
			return {years,months,days,hours,minutes,seconds,defaultVal}
			break;
		case "time":
			defaultVal=[hours.indexOf(tHours),minutes.indexOf(tMinutes),seconds.indexOf(tSeconds)];
			return {hours,minutes,seconds,defaultVal}
			break;			
	}
}
module.exports = {
	formatTime: formatTime,
	formatLocation: formatLocation,
	dateUtils: dateUtils,
	initDays,
	initPicker
}
