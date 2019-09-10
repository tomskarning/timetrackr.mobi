// STATISTICS.JS

// STARTUP
function startStatistics() {
	console.log("Loading statistics.");
	// Load.
	var d = new Date();
	$("#moreValvesTitle").html(translateMonth(monthNumToStr(d.getMonth())));
	if (load("settings").language != "en-US") {
		$("#moreValvesTitle").append(" "+languageData.pages.home.statistics);
	} else {
		$("#moreValvesTitle").append(" Statistics");
	}
	updateStatistics();
}

function updateStatistics() {
	console.log("Updating statistics.");
	// Money Earned.
	// Object: calendar.calendar[0].startDate
	var work		= load("work");
	var totalTime 	= 0;
	var totalEarned = 0;
	var thisMonth	= new Date().getMonth();
	var h 			= "h";
	
	if (load("settings").language != "en-US") {
		h = languageData.pages.calendar.terms.h;
	}
	
	for (var i = 1; i <= work.length; i++) {
		for (var n = 1; n <= work[i-1].calendar.length; n++) {
			var trackMonth 	= new Date(work[i-1].calendar[n-1].stopDate).getMonth();
			var hourlyPay	= work[i-1].calendar[n-1].salary;
			if (thisMonth == trackMonth) {
				var secondlyPay = (hourlyPay / 60) / 60;
				var timeDiff 	= new Date(work[i-1].calendar[n-1].stopDate).getTime() - new Date(work[i-1].calendar[n-1].startDate).getTime();
				var earned 		= (timeDiff / 1000) * secondlyPay;
				totalEarned    += earned;
				totalTime      += timeDiff;
			}
		}
	}
	$("#monthlySumContent").html(totalEarned.toFixed(0) + ",-");
	$("#monthlyHoursContent").html((((totalTime / 1000) / 60) / 60).toFixed(2) + h);
}