var typeArr = new Array(
	new Array( 32700000, "59㎡ 고층" ),
	new Array( 32300000, "59㎡ 중층" ),
	new Array( 31900000, "59㎡ 저층" ),
	new Array( 31300000, "59㎡ 3층" ),

	new Array( 38600000, "75㎡ A 고층" ),
	new Array( 38100000, "75㎡ A 중층" ),
	new Array( 37800000, "75㎡ A 저층" ),
	new Array( 37000000, "75㎡ A 3층" ),
	new Array( 36600000, "75㎡ A 2층" ),

	new Array( 38200000, "75㎡ B 고층" ),
	new Array( 37700000, "75㎡ B 중층" ),
	new Array( 37300000, "75㎡ B 저층" ),
	new Array( 36600000, "75㎡ B 3층" ),
	new Array( 36200000, "75㎡ B 2층" ),

	new Array( 41400000, "84㎡ 고층" ),
	new Array( 40700000, "84㎡ 중층" ),
	new Array( 40300000, "84㎡ 저층" ),
	new Array( 39500000, "84㎡ 3층" ),
	new Array( 39100000, "84㎡ 2층" )
);

var payDateArr = new Array( "2018-10-10", "2019-02-10", "2019-06-10", "2019-11-10", "2020-03-10", "2020-07-10" );
var inputPay = 32300000;

var inputRepayDateStr = "";
var minRepayDateStr = "2020-11-01";
var maxRepayDateStr = "2021-02-28";

var interestRateArr = new Array(
	new Array( "2018-10-10", 3.93 ),
	new Array( "2019-04-10", 4.05 ),
	new Array( "2019-10-10", 3.65 ),
	new Array( "2020-04-10", 3.65 ),
	new Array( "2020-10-10", 3.65 )
);
var totalInterest = 0;

$(document).ready(function() {
	setInputRepayDateStr();
	setType();
	setDate();
	calculate();
});

function setInputRepayDateStr() {
	var todayStr = getDateStr(new Date());
	if (todayStr < minRepayDateStr) {
		inputRepayDateStr = maxRepayDateStr;
	} else if (minRepayDateStr <= todayStr && todayStr <= maxRepayDateStr) {
		minRepayDateStr = todayStr;
		inputRepayDateStr = todayStr;
	} else {
		minRepayDateStr = maxRepayDateStr;
		inputRepayDateStr = maxRepayDateStr;
	}
}

function setType() {
	for (var i = 0; i < typeArr.length; i++) {
		var type = typeArr[i];
		$('#type').append($('<option/>', { value : type[0], text : type[1] }));
	}
	$('#type').val(inputPay);
	$('#type').change(function() {
		inputPay = +($(this).val());
		calculate();
	});
}

function setDate() {
	$('#date').datepicker({
		title : "종료일",
		format: "yyyy-mm-dd",
		startDate: minRepayDateStr,
		endDate: maxRepayDateStr,
		autoclose : true,
		language : "ko"
	});
	$('#date').datepicker('setDate', inputRepayDateStr);
	$('#date').on("changeDate", function() {
		inputRepayDateStr = $(this).val();
		calculate();
	});
}

function calculate() {
	totalInterest = 0;
	setDetailTitle();
	for (var i = 0; ; i++) {
		var startDate = getStartDate(payDateArr[0].split("-"), i);
		var endDate = getEndDate(payDateArr[0].split("-"), i);
		var totalPay = getTotalPay(startDate);
		var interestRate = getInterestRate(startDate);
		var interest = getInterest(startDate, endDate, totalPay, interestRate);
		totalInterest += interest;
		setDetailContents(startDate, endDate, totalPay, interestRate, interest);
		if (getDateStr(endDate) == inputRepayDateStr)
			break;
	}
	setSummaryTitle();
	setSummaryContents(getStartDate(payDateArr[0].split("-"), 0), endDate, totalPay);
}

function setSummaryTitle() {
	$('#summary tr').remove();
	var row = $('<tr/>', {});
	row.append($('<th/>', { text : '시작일', class : "hidden-xs" }));
	row.append($('<th/>', { text : '종료일' }));
	row.append($('<th/>', { text : '대출금' }));
	row.append($('<th/>', { text : '누적 이자' }));
	$('#summary').append(row);
}

function setDetailTitle() {
	$('#detail tr').remove();
	var row = $('<tr/>', {});
	row.append($('<th/>', { text : '시작일', class : "hidden-xs" }));
	row.append($('<th/>', { text : '종료일' }));
	row.append($('<th/>', { text : '대출금', class : "hidden-xs" }));
	row.append($('<th/>', { text : '금리' }));
	row.append($('<th/>', { text : '이자' }));
	row.append($('<th/>', { text : '누적 이자' }));
	$('#detail').append(row);
}

function getStartDate(dateArr, setMonth) {
	var date = new Date(dateArr[0], dateArr[1] - 1, dateArr[2]);
	date.setMonth(date.getMonth() + setMonth);
	return date;
}

function getEndDate(dateArr, setMonth) {
	var date = new Date(dateArr[0], dateArr[1], 9);
	date.setMonth(date.getMonth() + setMonth);
	if (getDateStr(date) > inputRepayDateStr) {
		return getDate(inputRepayDateStr);
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
			totalPay += inputPay;
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
	var oneDayInterest = isPayDateAndSunDay(startDate) ? (totalPay - inputPay) / getDayOfYear(startDate) * (getInterestRate(startDate) / 100) : 0;
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
	if (payDateArr.indexOf(getDateStr(date) >= 0) && date.getDay() == 0)
		return true;
	return false;
}

function getDayOfYear(date) {
	var year = date.getFullYear();
	if ((year % 4 == 0 && year % 100 != 0) || year % 400 == 0)
		return 366;
	return 365;
}

function setSummaryContents(startDate, endDate, totalPay) {
	var row = $('<tr/>', {});
	row.append($('<td/>', { text : getDateStr(startDate), class : "hidden-xs" }));
	row.append($('<td/>', { text : getDateStr(endDate) }));
	row.append($('<td/>', { text : $.number(totalPay) }));
	row.append($('<td/>', { text : $.number(totalInterest), style : 'color : blue;' }));
	$('#summary').append(row);
}

function setDetailContents(startDate, endDate, totalPay, interestRate, interest) {
	var row = $('<tr/>', {});
	row.append($('<td/>', { text : getDateStr(startDate), class : "hidden-xs" }));
	row.append($('<td/>', { text : getDateStr(endDate) }));
	row.append($('<td/>', { text : $.number(totalPay), class : "hidden-xs" }));
	row.append($('<td/>', { text : interestRate }));
	row.append($('<td/>', { text : $.number(interest) }));
	row.append($('<td/>', { text : $.number(totalInterest) }));
	$('#detail').append(row);
}