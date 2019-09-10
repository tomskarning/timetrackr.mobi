// PREMIUM.JS

// MAIN
function activatePremium() {
	console.log("Activating premium.");
	$("#premiumAds").hide();
	$("#premiumBuy").hide();
	
	var language = loadOne("settings", "language");
	if (language == "en-US") {
		$("#headerView").find("h1").html("<span style='color: rgba(255, 215, 0, 1);'>You Are Premium</span>");
	} else {
		$("#headerView").find("h1").html(languageData.header.premium);
	}

	$("#gps").show();
	$(window).load(function() {
		$("#gps").show();
	});

	$("#csv").show();
	$(window).load(function() {
		$("#csv").show();
	});

	$(".calendarBottom").show();
	$(window).load(function() {
		$(".calendarBottom").show();
	});

	$("#sendSmsNow").show();
	$(window).load(function() {
		$("#sendSmsNow").show();
	});

	$("#sendEmailNow").show();
	$(window).load(function() {
		$("#sendEmailNow").show();
	});
}


$(document).on("tap", "#csv", function() {
	exportToCsv();
});

$(document).on("tap", "#sendSmsNow", function() {
	var date = new Date();
	date = date.getDate() + ". " + monthNumToStr(date.getMonth()) + " " + date.getFullYear();

	var startTime = new Date(load("calc").startDate);
	var stopTime = new Date(load("calc").stopDate);

	var duration = (stopTime.getTime() - startTime.getTime()) / 1000;

	if (load("settings").timeConvention == 12) {
		startTime = formatAMPM(startTime);
		stopTime = formatAMPM(stopTime);
	} else if (load("settings").timeConvention == 24) {
		startTime = startTime.getHours() + ":" + startTime.getMinutes();
		stopTime = stopTime.getHours() + ":" + stopTime.getMinutes();
	}

	var durationPrefix = "s";
	if (duration >= 60 && duration < 3600) {
		duration = duration / 60;
		durationPrefix = "m";
	} else if (duration >= 3600) {
		duration = duration / 3600;
		durationPrefix = "h";
	}

	var workDuration 	= duration.toFixed(1) + durationPrefix;
	var workPay 		= load("calc").accumulator.toFixed(2) + ",-";
	var gpsMap 			= "";
	
	if (load('calc').startGps && load('calc').stopGps) {
		gpsMap = "http://maps.google.com/maps/api/staticmap?size=512x512&markers=color:0x444499|label:A|" + load('calc').startGps + "&markers=color:0x444499|label:B|" + load('calc').stopGps + "&sensor=false&key=AIzaSyApH846bv25U4AlefpIg2F5g1_xN-6KAw8";
	}

	sendSMS(date, startTime, stopTime, workDuration, workPay, gpsMap);
});

$(document).on("tap", "#sendEmailNow", function() {
	var date = new Date();
	date = date.getDate() + ". " + monthNumToStr(date.getMonth()) + " " + date.getFullYear();

	var startTime = new Date(load("calc").startDate);
	var stopTime = new Date(load("calc").stopDate);

	var duration = (stopTime.getTime() - startTime.getTime()) / 1000;

	if (load("settings").timeConvention == 12) {
		startTime = formatAMPM(startTime);
		stopTime = formatAMPM(stopTime);
	} else if (load("settings").timeConvention == 24) {
		startTime = startTime.getHours() + ":" + startTime.getMinutes();
		stopTime = stopTime.getHours() + ":" + stopTime.getMinutes();
	}

	var durationPrefix = "s";
	if (duration >= 60 && duration < 3600) {
		duration = duration / 60;
		durationPrefix = "m";
	} else if (duration >= 3600) {
		duration = duration / 3600;
		durationPrefix = "h";
	}

	var workDuration = duration.toFixed(1) + durationPrefix;

	var workPay 	= load("calc").accumulator.toFixed(2) + ",-";
	var gpsMap 		= "";
	if (load('calc').startGps && load('calc').stopGps) {
		gpsMap = "http://maps.google.com/maps/api/staticmap?size=512x512&markers=color:0x444499|label:A|" + load('calc').startGps + "&markers=color:0x444499|label:B|" + load('calc').stopGps + "&sensor=false&key=AIzaSyApH846bv25U4AlefpIg2F5g1_xN-6KAw8";
	}

	sendEmail(date, startTime, stopTime, workDuration, workPay, gpsMap);
});

function exportToCsv() {
	console.log("Exporting calendars in localstorage to CSV.");
	var $link 	= $("#dataLink");
	var work 	= load("work");
	var csv		= "";
	if (load("settings").language != "en-US") {
		csv	    = languageData.exports.csv.firstLine+"\n";
	} else {
		csv	    = "Work;Date;StartTime;StopTime;MoneyEarned;StartGPS;StopGPS\n";
	}
	var startMinutes;
	var stopMinutes;
	var i = 0;
	var x = 0;
	
	if (load("settings").timeConvention == 12) {
		for (i = 0; i < work.length; i++) {
			calendar = work[i].calendar;
			for (x = 0; x < calendar.length; x++) {
				csv += work[i].name + ";";
				csv += new Date(calendar[x].startDate).getDate() + "/" + new Date(calendar[x].startDate).getMonth() + "/" + new Date(calendar[x].startDate).getFullYear() + ";";
				csv += formatAMPM(new Date(calendar[x].startDate)) + ";";
				csv += formatAMPM(new Date(calendar[x].stopDate)) + ";";
				csv += calendar[x].accumulator.toFixed(2) + ";";
				csv += calendar[x].startGps + ";";
				csv += calendar[x].stopGps + "\n";
			}
		}
	} else if (load("settings").timeConvention == 24) {
		for (i = 0; i < work.length; i++) {
			calendar = work[i].calendar;
			for (x = 0; x < calendar.length; x++) {
				csv += work[i].name + ";";
				csv += new Date(calendar[x].startDate).getDate() + "/" + new Date(calendar[x].startDate).getMonth() + "/" + new Date(calendar[x].startDate).getFullYear() + ";";
				startMinutes = new Date(calendar[x].startDate).getMinutes();
				stopMinutes = new Date(calendar[x].stopDate).getMinutes();
				if (startMinutes <= 9) {
					startMinutes = "0"+startMinutes;
				}
				if (stopMinutes <= 9) {
					stopMinutes = "0"+stopMinutes;
				}
				csv += new Date(calendar[x].startDate).getHours() + ":" + startMinutes + ";";
				csv += new Date(calendar[x].stopDate).getHours() + ":" + stopMinutes + ";";
				csv += calendar[x].accumulator.toFixed(2) + ";";
				csv += calendar[x].startGps + ";";
				csv += calendar[x].stopGps + "\n";
			}
		}
	}
	
	sendEmailCsv(csv);
}
