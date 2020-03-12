$(document).ready(function() {
	init();
	execute();
});

var minDate = "2018-10-10";
var maxDate = "2021-02-28";
var inputEndDateStr = "2021-02-28";
var pay = 32300000;
var payDateArr = new Array( "2018-10-10", "2019-02-10", "2019-06-10", "2019-11-10", "2020-03-10", "2020-07-10" );
var interestRateArr = new Array(
	new Array( "2018-10-10", 3.93 ),
	new Array( "2019-04-10", 4.05 ),
	new Array( "2019-10-10", 3.65 ),
	new Array( "2020-04-10", 3.65 ),
	new Array( "2020-10-10", 3.65 )
);
var totalInterest = 0;

function init() {
	$('#type').niceSelect();
	$('#type').change(function() {
		pay = +($(this).val());
		$('#loan tr').remove();
		execute();
	});
	$('#date').change(function() {
		if ($(this).val() < minDate || $(this).val() > maxDate) {
			$(this).val(maxDate);
		}
		inputEndDateStr = $(this).val();
		$('#loan tr').remove();
		execute();
	});
}

function execute() {
	totalInterest = 0;
	appendTitle();
	for (var i = 0; ; i++) {
		var startDate = getStartDate(payDateArr[0].split("-"), i);
		var endDate = getEndDate(payDateArr[0].split("-"), i);
		if (getDateStr(startDate) > inputEndDateStr)
			break;
		var totalPay = getTotalPay(startDate);
		var interestRate = getInterestRate(startDate);
		var interest = getInterest(startDate, endDate, totalPay, interestRate);
		totalInterest += interest;
		appendContents(startDate, endDate, totalPay, interestRate, interest);
		if (getDateStr(endDate) == inputEndDateStr)
			break;
	}
}

function appendTitle() {
	var row = $('<tr/>', {});
	row.append($('<th/>', { text : '시작일' }));
	row.append($('<th/>', { text : '종료일' }));
	row.append($('<th/>', { text : '대출금' }));
	row.append($('<th/>', { text : '금리' }));
	row.append($('<th/>', { text : '이자' }));
	row.append($('<th/>', { text : '누적 이자' }));
	$('#loan').append(row);
}

function getStartDate(dateArr, setMonth) {
	var date = new Date(dateArr[0], dateArr[1] - 1, dateArr[2]);
	date.setMonth(date.getMonth() + setMonth);
	return date;
}

function getEndDate(dateArr, setMonth) {
	var date = new Date(dateArr[0], dateArr[1], 9);
	date.setMonth(date.getMonth() + setMonth);
	if (getDateStr(date) > inputEndDateStr) {
		return getDate(inputEndDateStr);
	}
	return date;
}

function getDate(dataStr) {
	var dateArr = dataStr.split("-");
	return new Date(dateArr[0], dateArr[1] - 1, dateArr[2]);
}

function getDateStr(date) {
	return date.getFullYear() + "-" + getNumberStr((date.getMonth() + 1)) + "-" + getNumberStr(date.getDate());
}

function getNumberStr(number) {
	if (number < 10)
		return "0" + number;
	return number;
}

function getTotalPay(startDate) {
	var totalPay = 0;
	var startDateStr = getDateStr(startDate);
	for (var i = 0; i < payDateArr.length; i++) {
		if (payDateArr[i] <= startDateStr) {
			totalPay += pay;
		}
	}
	return totalPay;
}

function getInterestRate(startDate) {
	var interestRate = 0;
	var startDateStr = getDateStr(startDate);
	for (var i = 0; i < interestRateArr.length; i++) {
		if (interestRateArr[i][0] > startDateStr)
			break;
		interestRate = interestRateArr[i][1];
	}
	return interestRate;
}

function getInterest(startDate, endDate, totalPay, interestRate) {
	var startMonthDay = getStartMonthDay(startDate, endDate);
	var startMonthInterest = startMonthDay != 0 ? (totalPay * startMonthDay / getDayOfYear(startDate) * (interestRate / 100)) : 0;
	var endMonthDay = getEndMonthDay(startDate, endDate);
	var endMonthInterest = endMonthDay != 0 ? (totalPay * endMonthDay / getDayOfYear(endDate) * (interestRate / 100)) : 0;
	var oneDayInterest = isPayDateAndSunDay(startDate) ? (totalPay - pay) / getDayOfYear(startDate) * (getInterestRate(startDate) / 100) : 0;
	return Math.floor(startMonthInterest + endMonthInterest + oneDayInterest);
}

function getStartMonthDay(startDate, endDate) {
	if (startDate == endDate) {
		return isPayDateAndSunDay(startDate) ? 0 : 1;
	} else if (startDate.getFullYear() == endDate.getFullYear() && startDate.getMonth() == endDate.getMonth()) {
		return ((endDate - startDate) / (24 * 60 * 60 * 1000)) + (isPayDateAndSunDay(startDate) ? 0 : 1);
	} else {
		var lastDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0).getDate();
		return lastDate - startDate.getDate() + (isPayDateAndSunDay(startDate) ? 0 : 1)
	}
}

function getEndMonthDay(startDate, endDate) {
	if (startDate.getFullYear() == endDate.getFullYear() && startDate.getMonth() == endDate.getMonth())
		return 0;
	return endDate.getDate();
}

function isPayDateAndSunDay(date) {
	if (payDateArr.includes(getDateStr(date)) && date.getDay() == 0)
		return true;
	return false;
}

function getDayOfYear(date) {
	var year = date.getFullYear();
	if ((year % 4 == 0 && year % 100 != 0) || year % 400 == 0)
		return 366;
	return 365;
}

function appendContents(startDate, endDate, totalPay, interestRate, interest) {
	var row = $('<tr/>', {});
	row.append($('<td/>', { text : getDateStr(startDate) }));
	row.append($('<td/>', { text : getDateStr(endDate) }));
	row.append($('<td/>', { text : $.number(totalPay) }));
	row.append($('<td/>', { text : interestRate }));
	row.append($('<td/>', { text : $.number(interest) }));
	row.append($('<td/>', { text : $.number(totalInterest) }));
	$('#loan').append(row);
}