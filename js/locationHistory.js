$(document).ready(function() {
	var key = '1mVzwpD6O_SuX1aX_JQTTCWyYY9NjODfMjV5u1t29e7w';
	var worksheet = '1';
	$.googleSheetToJSON(key, worksheet).done(function(rows) {
		setLocationHistoryTitle();
		setLocationHistoryContents(rows);
	});
});

function setLocationHistoryTitle() {
	$("#locationHistory").append($('<tr/>')
		.append($('<th/>', { html : '시각' }))
		.append($('<th/>', { html : '위도' }))
		.append($('<th/>', { html : '경도' }))
		.append($('<th/>', { html : '지도' }))
	);
}

function setLocationHistoryContents(rows) {
	rows.reverse();
	for (var row of rows) {
		$("#locationHistory").append($('<tr/>', {})
			.append($('<td/>', { html : row['timestamp'], align : 'center' }))
			.append($('<td/>', { html : getSummaryLocation(row['latitude']) }))
			.append($('<td/>', { html : getSummaryLocation(row['longitude']) }))
			.append($('<td/>', { align : 'center', html : 
				$('<button/>', {
					class : 'btn btn-success',
					style : 'height : 20px; line-height : 8px;',
					onclick : "javascript:openMap(" + row['latitude'] + ", " + row['longitude'] + ");",
					text : '확인'
				})
			}))
		);
	}
}

function getSummaryLocation(value) {
	return value.substring(0, value.indexOf('.') + 4);
}

function openMap(latitude, longitude) {
	if (latitude == null || longitude == null)
		return;
	location.href = 'https://m.map.naver.com?lat=' + latitude + '&lng=' + longitude;
}