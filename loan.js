$(document).ready(function() {
	loan();
});

var count = 29;
var payDate = new Array( "2018-10-10", "2019-02-10", "2019-06-10", "2019-11-10", "2020-03-10", "2020-07-10" );
var pay = 32300000;
var interestRateArr = new Array(
	new Array( "2018-10-10", 3.93 ),
	new Array( "2019-04-10", 4.05 ),
	new Array( "2019-10-10", 3.65 ),
	new Array( "2020-04-10", 3.65 ),
	new Array( "2020-10-10", 3.65 )
);
var totalInterest = 0;

function loan() {
	for (var i = 0; i < count; i++) {
		var startDate = getStartDate(payDate[0].split("-"), i);
		var endDate = getEndDate(payDate[0].split("-"), i);
		var totalPay = getTotalPay(startDate);
		var interestRate = getInterestRate(startDate);
		var interest = getInterest(startDate, endDate, totalPay, interestRate);
		append(startDate, endDate, totalPay, interestRate, interest);
	}
}

function getStartDate(dateArr, setMonth) {
	var date = new Date(dateArr[0], dateArr[1] - 1, dateArr[2]);
	date.setMonth(date.getMonth() + setMonth);
	return date;
}

function getEndDate(dateArr, setMonth) {
	var date = new Date(dateArr[0], dateArr[1], 9);
	date.setMonth(date.getMonth() + setMonth);
	return date;
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
	for (var i = 0; i < payDate.length; i++) {
		if (payDate[i] <= startDateStr) {
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
	var	day = (endDate - startDate) / (24 * 60 * 60 * 1000) + 1;
	var interest = Math.floor(
		(totalPay * (getLastDate(startDate) - startDate.getDate() + 1) / getDayOfYear(startDate) * (interestRate / 100))
			+ (totalPay * endDate.getDate() / getDayOfYear(endDate) * (interestRate / 100))
		);
	if (payDate.includes(getDateStr(startDate)) && startDate.getDay() == 0) {
		interest = Math.floor(
			(totalPay * (day - 1) / getDayOfYear(startDate) * (interestRate / 100))
				+  ((totalPay - pay) / getDayOfYear(startDate)) * (getInterestRate(startDate) / 100)
		);
	}
	totalInterest = totalInterest + interest;
	return interest;
}

function getLastDate(date) {
	return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
}

function getDayOfYear(date) {
	var year = date.getFullYear();
	if ((year % 4 == 0 && year % 100 != 0) || year % 400 == 0)
		return 366;
	return 365;
}

function append(startDate, endDate, totalPay, interestRate, interest) {
	var row = $('<tr/>', {});
	var cell = new Array();
	cell.push($('<td/>', { text : getDateStr(startDate) }));
	cell.push($('<td/>', { text : getDateStr(endDate) }));
	cell.push($('<td/>', { text : $.number(totalPay) }));
	cell.push($('<td/>', { text : interestRate }));
	cell.push($('<td/>', { text : $.number(interest) }));
	cell.push($('<td/>', { text : $.number(totalInterest) }));
	for (var i = 0; i < cell.length; i++) {
		row.append(cell[i]);
	}
	$('#loan').append(row);
}