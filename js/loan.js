var inputPay = 0;
var inputRepayDateStr = "";
var minRepayDateStr = "2020-11-01";
var maxRepayDateStr = "2021-02-28";
var payDateArr = new Array( "2018-10-10", "2019-02-10", "2019-06-10", "2019-11-10", "2020-03-10", "2020-07-10" );
var interestRateArr = new Array(
	new Array( "2018-10-10", 3.93 ),
	new Array( "2019-04-10", 4.05 ),
	new Array( "2019-10-10", 3.65 ),
	new Array( "2020-04-10", 3.65 ),
	new Array( "2020-10-10", 3.65 )
);
var totalInterest = 0;

$(document).ready(function() {
	setTypeValue();
	setInputRepayDateStr();
	setDateValue();
	setBind();
	execute();
});

function setTypeValue() {
	inputPay = 32300000;
	$('#type').append($('<option/>', { value : 32700000, text : '59㎡ 고층' }));
	$('#type').append($('<option/>', { value : 32300000, text : '59㎡ 중층' }));
	$('#type').append($('<option/>', { value : 31900000, text : '59㎡ 저층' }));
	$('#type').append($('<option/>', { value : 31300000, text : '59㎡ 3층' }));
	$('#type').append($('<option/>', { value : 38600000, text : '75㎡ A 고층' }));
	$('#type').append($('<option/>', { value : 38100000, text : '75㎡ A 중층' }));
	$('#type').append($('<option/>', { value : 37800000, text : '75㎡ A 저층' }));
	$('#type').append($('<option/>', { value : 37000000, text : '75㎡ A 3층' }));
	$('#type').append($('<option/>', { value : 36600000, text : '75㎡ A 2층' }));
	$('#type').append($('<option/>', { value : 38200000, text : '75㎡ B 고층' }));
	$('#type').append($('<option/>', { value : 37700000, text : '75㎡ B 중층' }));
	$('#type').append($('<option/>', { value : 37300000, text : '75㎡ B 저층' }));
	$('#type').append($('<option/>', { value : 36600000, text : '75㎡ B 3층' }));
	$('#type').append($('<option/>', { value : 36200000, text : '75㎡ B 2층' }));
	$('#type').append($('<option/>', { value : 41400000, text : '84㎡ 고층' }));
	$('#type').append($('<option/>', { value : 40700000, text : '84㎡ 중층' }));
	$('#type').append($('<option/>', { value : 40300000, text : '84㎡ 저층' }));
	$('#type').append($('<option/>', { value : 39500000, text : '84㎡ 3층' }));
	$('#type').append($('<option/>', { value : 39100000, text : '84㎡ 2층' }));
	$('#type').val(inputPay);
}

function setInputRepayDateStr() {
	var todayStr = getDateStr(new Date());
	if (todayStr < minRepayDateStr) {
		todayStr = maxRepayDateStr;
	} else if (minRepayDateStr <= todayStr && todayStr <= maxRepayDateStr) {
		minRepayDateStr = todayStr;
	} else {
		minRepayDateStr = maxRepayDateStr;
		todayStr = maxRepayDateStr;
	}
	inputRepayDateStr = todayStr;
}

function setDateValue() {
	var minRepayDateArr = minRepayDateStr.split("-");
	var count = 0;
	while(1) {
		var repayDate = getDateStr(new Date(minRepayDateArr[0], minRepayDateArr[1] - 1, (+minRepayDateArr[2] + count)));
		$('#date').append($('<option/>', { value : repayDate, text : repayDate }));
		if (repayDate == maxRepayDateStr)
			break;
		count++;
	}
	$('#date').val(inputRepayDateStr);
}

function setBind() {
	$('#type').change(function() {
		inputPay = +($(this).val());
		execute();
	});
	$('#date').change(function() {
		inputRepayDateStr = $(this).val();
		execute();
	});
}

function execute() {
	totalInterest = 0;
	setTitle();
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
	setSummaryContents(new Date(payDateArr[0].split("-")), endDate, totalPay);
}

function setTitle() {
	$('tr').remove();
	setSummaryTitle();
	setDetailTitle();
}

function setSummaryTitle() {
	var row = $('<tr/>', {});
	row.append($('<th/>', { text : '시작일', class : "hidden-xs" }));
	row.append($('<th/>', { text : '종료일' }));
	row.append($('<th/>', { text : '대출금' }));
	row.append($('<th/>', { text : '누적 이자' }));
	$('#summary').append(row);
}

function setDetailTitle() {
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
