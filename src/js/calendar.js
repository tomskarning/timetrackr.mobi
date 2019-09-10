// CALENDAR.JS

// STARTUP
function loadCalendar() {
	console.log("Loading calendar.");
	var height = ($("#calendarCircle").css("width").replace("%", "") * document.width / 100);
	$("#calendarCircle").height(height);
	console.log("Calendar height should be: "+height+".");
	
    var current		= 0;
	var firstRun 	= 1;
	$("#calendar").bind('touchmove', function (evt) {
	    var touch = evt.originalEvent.touches[0];	        
	    var el = $(document.elementFromPoint(touch.clientX, touch.clientY));
	    
	   if (el.hasClass('cw') && (el.hasClass('disabled') != 1)) {
	    	if ( (firstRun == 1) || (parseInt(el.html()) != current) ) {
		    	
		    	$("#prevEntry").addClass("disabled");
		    	currentEntry = 0;
		    	chosenDate.setDate(el.html());
		    	setupMonthsAndDays();
		    	
		    	current 	= parseInt(el.html());
		    	firstRun	= 0;
	    	}
	    }
	});
	
	var cD = new Date().getDate() - 1;
	$(".cw:eq("+cD+")").addClass("active");
	$(".cw:eq("+cD+")").addClass("current");
	
	$(document).on("tap", ".cw", function() {
		if ($(this).hasClass("disabled") != 1) {
			$('.cw').removeClass('active');
    		$(this).addClass('active');
    		
    		$("#prevEntry").addClass("disabled");
    		currentEntry = 0;
    		chosenDate.setDate($(this).html());
			setupMonthsAndDays();
		}
	});
	
	setupMonthsAndDays();
}

// CALENDAR GLOBALS.
var monthsArray 	= [];
var activeMonth 	= null;
var currentDate		= new Date();
var chosenDate		= new Date();
var currentEntry 	= 0;
var entries 		= $(".calendarEntry").length;

// FUNCTIONS
function setupMonthsAndDays() {
	console.log("Setting up months and days in calendar.");
	var work   		= load("work");
	for (var i = 0; i < work.length; i++) {
		var recordings = work[i].calendar;
		for (var x = 0; x < recordings.length; x++) {
			var calendar = work[i].calendar[x];
			var calendarDate = new Date(calendar.startDate);
			if ( $.inArray((calendarDate.getMonth()+1)+","+daysInMonth(calendarDate.getMonth()+1,calendarDate.getFullYear()), monthsArray) <= -1 ) {
				monthsArray.push((calendarDate.getMonth()+1)+","+daysInMonth(calendarDate.getMonth()+1,calendarDate.getFullYear()));
			}
		}
	}
	
	monthsArray.sort();
	
	for (i = 0; i < monthsArray.length; i++) {
		var months 	= monthsArray[i];
		months		= months.split(",");
		var month	= months[0];
		var daysIn	= months[1];
	}
	
	$(".cw").removeClass("disabled");
	var totalDays = daysInMonth(new Date(chosenDate).getMonth()+1, new Date(chosenDate).getFullYear());
	for (var d = 31; d > totalDays; d--) {
		$(".cw:eq("+(d-1)+")").addClass("disabled");
	}
	
	setCalendarContent(chosenDate);
}

function setCalendarContent(chosenDate) {
	console.log("Setting calendar content to "+chosenDate);
	activeMonth = chosenDate.getMonth();
	$("#calendarMonthAndYear").html("<span data-month='"+chosenDate.getMonth()+"' id='calendarMonth'>" + translateMonth(monthNumToStr(chosenDate.getMonth())) + "</span><br /><span id='calendarYear'>" + chosenDate.getFullYear() + "</span>");
	$("#calendarDayOfMonth").html(chosenDate.getDate());
	$("#calendarDay").html(translateDay(dayNumToShortStr(chosenDate.getDay())));
	
	var entriesToLoad = [];
	
	var work = load("work");
	for (var i = 0; i < work.length; i++) {
		var recordings = work[i].calendar;
		for (var x = 0; x < recordings.length; x++) {
			var date = new Date(work[i].calendar[x].startDate);
			var calendar = work[i].calendar[x];
			if ( ($("#calendarYear").html() == date.getFullYear()) && ($("#calendarMonth").data("month") == date.getMonth()) ) {
				if (chosenDate.getDate() == date.getDate()) {
					entriesToLoad.push(calendar);
				} 
			}
		}
	}
	rotateCalendarPointer(chosenDate.getDate());
	reloadCalendar(entriesToLoad);
}

function rotateCalendarPointer(current) {
	console.log("Rotating calendar.");
	$('.cw').removeClass('active');
	$(".cw:eq("+(current-1)+")").toggleClass('active');
	var diff 	= 360 / 32;
	var degrees = parseInt(current) * diff;
	var adjust 	= (degrees / 180 - 1) * 14;
	var real 	= degrees - adjust;
	
	$("#calendarCirclePointer").css({ WebkitTransform: "rotate("+real+"deg)"});
}

function reloadCalendar(entries) {
	console.log("Reloading calendar.");
	Handlebars.registerHelper("getWorkName", function(id) {
		return load("work")[id].name;
	});
	
	Handlebars.registerHelper("extractTime", function(date) {
		if (load("settings").timeConvention == 12) {
			return formatAMPM(new Date(date));
		} else if (load("settings").timeConvention == 24) {
			var minutes = new Date(date).getMinutes();
			if (minutes <= 9) {
				minutes = "0"+minutes;
			}
			return new Date(date).getHours()+":"+minutes;
		}
	});
	
	Handlebars.registerHelper("getWorkDuration", function(startDate, stopDate) {
		var duration = (new Date(stopDate).getTime() - new Date(startDate).getTime()) / 1000;
		durationPrefix = "";
		
		if (load("settings").language != "en-US") {
			durationPrefix = languageData.pages.calendar.terms.s;
			if (duration >= 60 && duration < 3600) {
				duration = duration / 60;
				durationPrefix = languageData.pages.calendar.terms.m;
			} else if  (duration >= 3600) {
				duration = duration / 3600;
				durationPrefix = languageData.pages.calendar.terms.h;
			}
		} else {
			durationPrefix = "s";
			if (duration >= 60 && duration < 3600) {
				duration = duration / 60;
				durationPrefix = "m";
			} else if  (duration >= 3600) {
				duration = duration / 3600;
				durationPrefix = "h";
			}
		}
		
		return duration.toFixed(1) + durationPrefix;
	});
	
	Handlebars.registerHelper("workPay", function(pay) {
		return pay.toFixed(2)+",-";
	});
	
	Handlebars.registerHelper("standardText", function() {
		if (load("settings").language != "en-US") {
			return new Handlebars.SafeString("<span id='nothingRecorded'>"+languageData.pages.calendar.standardText+"</span>");
		} else {
			return new Handlebars.SafeString("<span id='nothingRecorded'>Nothing has been<br />recorded on this date.</span>");
		}
	});
	
	Handlebars.registerHelper("gpsUrl", function(startGps, stopGps) {
		if (startGps && stopGps) {
			return "http://maps.google.com/maps/api/staticmap?size=512x512&markers=color:0x444499|label:A|"+startGps+"&markers=color:0x444499|label:B|"+stopGps+"&sensor=false&key=AIzaSyApH846bv25U4AlefpIg2F5g1_xN-6KAw8";
		} else {
			return "";
		}
	});
	
	var template 	= Handlebars.templates["calendar.hbs"];
	var data 		= entries;
	var output 		= template({entries: data});
	$("#calendarInfo").html(output);
	
	calendarEntriesNav();
}

function calendarEntriesNav() {
	console.log("Getting calendar entries on this day.");
	entries = $(".calendarEntry").length;
	
	$(".calendarEntry").eq(currentEntry).addClass("active");
	if (entries === 0) {
		$("#entriesCurrent").html(currentEntry);
		$("#nextEntry").addClass("disabled");
	} else if (entries === 1) {
		$("#nextEntry").addClass("disabled");
		$("#entriesCurrent").html(currentEntry+1);
	} else {
		$("#entriesCurrent").html(currentEntry+1);
	}
	
	$("#entriesTotal").html(entries);
	
	if (entries >= 2) {
		$("#nextEntry").removeClass("disabled");
	}
}

$(document).on("tap", "#nextEntry", function() {
	if ((currentEntry + 1) < entries) {
		currentEntry++;
		
		$(".calendarEntry").animate({
			marginLeft: "-250%",
			opacity: 0
		}, 250, "linear");
		
		setTimeout(function() {
			$(".calendarEntry").removeClass("active");
			$(".calendarEntry").eq(currentEntry).addClass("active");
			$("#prevEntry").removeClass("disabled");
			$("#entriesCurrent").html(currentEntry+1);
			
			if ((currentEntry + 1) == entries) {
				$("#nextEntry").addClass("disabled");
			}
		}, 500);
		
		$(".calendarEntry").animate({
			marginLeft: "0px",
			marginRight: "-250%",
		}, 0, "linear");
		
		$(".calendarEntry").animate({
			marginLeft: "0px",
			marginRight: "0px",
			opacity: 1
		}, 250, "linear");
	}
});

$(document).on("tap", "#prevEntry", function() {
	if ((currentEntry + 1) > 1) {
		currentEntry--;
		
		$(".calendarEntry").animate({
			marginRight: "-250%",
			opacity: 0
		}, 250, "linear");
		
		setTimeout(function() {
			$(".calendarEntry").removeClass("active");
			$(".calendarEntry").eq(currentEntry).addClass("active");
			$("#nextEntry").removeClass("disabled");
			$("#entriesCurrent").html(currentEntry+1);
			
			if ((currentEntry + 1) === 1) {
				$("#prevEntry").addClass("disabled");
			}
		}, 500);
		
		$(".calendarEntry").animate({
			marginRight: "0px",
			marginLeft: "-250%",
		}, 0, "linear");
		
		$(".calendarEntry").animate({
			marginLeft: "0px",
			marginRight: "0px",
			opacity: 1
		}, 250, "linear");
	}
});

$(document).on("tap", "#prevMonth", function() {
	activeMonth--;
	currentEntry = 0;
	chosenDate.setMonth(activeMonth);
	setupMonthsAndDays();
});

$(document).on("tap", "#currentMonth", function() {
	activeMonth = currentDate.getMonth();
	currentEntry = 0;
	chosenDate.setMonth(currentDate.getMonth());
	chosenDate.setFullYear(currentDate.getFullYear());
	setupMonthsAndDays();
});

$(document).on("tap", "#nextMonth", function() {
	activeMonth++;
	currentEntry = 0;
	chosenDate.setMonth(activeMonth);
	setupMonthsAndDays();
});

$(document).on("tap", "#gpsShow", function() {
	$(".gpsMap").toggleClass("active");
	$(".sendContent").removeClass("active");
});

$(document).on("tap", "#sendSms", function() {
	if ($("#nothingRecorded").length === 0) {
		var date	 	= $("#calendarDayOfMonth").html()+". "+$("#calendarMonth").html()+" "+$("#calendarYear").html();
		var startTime 	= $(".calendarEntry.active").children(".startTime").html();
		var stopTime 	= $(".calendarEntry.active").children(".stopTime").html();
		var workDuration= $(".calendarEntry.active").children(".calendarWorkDuration").html();
		var workPay		= $(".calendarEntry.active").children(".calendarWorkPay").html();
		var gpsMap		= $(".calendarEntry.active").children(".gpsMap").attr("src");
		
		sendSMS(date, startTime, stopTime, workDuration, workPay, gpsMap);
	}
});

$(document).on("tap", "#sendEmail", function() {
	if ($("#nothingRecorded").length === 0) {
		var date	 	= $("#calendarDayOfMonth").html()+". "+$("#calendarMonth").html()+" "+$("#calendarYear").html();
		var startTime 	= $(".calendarEntry.active").children(".startTime").html();
		var stopTime 	= $(".calendarEntry.active").children(".stopTime").html();
		var workDuration= $(".calendarEntry.active").children(".calendarWorkDuration").html();
		var workPay		= $(".calendarEntry.active").children(".calendarWorkPay").html();
		var gpsMap		= $(".calendarEntry.active").children(".gpsMap").attr("src");
		
		sendEmail(date, startTime, stopTime, workDuration, workPay, gpsMap);
	}
});
