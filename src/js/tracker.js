// TRACKER.JS

// MAIN
function checkTrackerStatus() {
	console.log("Checking tracker is running or not.");
	if (load("active").running == 1) {
		startCalc(calc.startDate);
		console.log("Tracker is running, starting accumulator.");
	}
	
	$(document).on("tap", "#calc", function() {
		var active = load("active");
		
		if (active.running == 1) {
			console.log("Stopping tracker.");
			clearInterval(loop);
			var earned 		= $("#stampIn").html();
			var stopDate 	= new Date();
			calc.stopDate 	= stopDate;
			calc.salary		= load("work")[active.id].salary;
			calc.id 		= active.id;
			
			if (load("settings").gps === 1) {
				navigator.geolocation.getCurrentPosition(function(position) {
					var cor = position.coords.latitude + "," + position.coords.longitude;
					calc.stopGps = cor;
					save("calc", calc); saveCalcEnd();
				}, onError);
			} else { save("calc", calc); saveCalcEnd(); }
			
			$("#stampIn").removeClass("running");
			if (load("settings").language != "en-US") {
				$("#stampIn").html(languageData.pages.home.start);
			} else {
				$("#stampIn").html("Start");
			}
			$("#tapToStop").hide();
			$("#multiplier").hide();
			
			var duration = (new Date(calc.stopDate).getTime() - new Date(calc.startDate).getTime()) / 1000;
			var durationPrefix = "";
			if (load("settings").language != "en-US") {
				durationPrefix = " " + languageData.pages.calendar.terms.seconds;
				if (duration >= 60 && duration < 3600) {
					duration = duration / 60;
					durationPrefix = " " + languageData.pages.calendar.terms.minutes;
				} else if  (duration >= 3600) {
					duration = duration / 3600;
					durationPrefix = " " + languageData.pages.calendar.terms.hours;
				}
			} else {
				durationPrefix = " seconds";
				if (duration >= 60 && duration < 3600) {
					duration = duration / 60;
					durationPrefix = " minutes";
				} else if  (duration >= 3600) {
					duration = duration / 3600;
					durationPrefix = " hours";
				}
			}
			
			console.log("Showing results.");
			$("#moneyEarned").html(earned+",-");
			$("#workDuration").html(duration.toFixed(1) + durationPrefix);
			$("#trackerWrapper").css("z-index", 2);
			playSound("audio/241809__suntemple__magic-sfx-for-games.mp3");
			coinAnimation = setInterval(function() { coinAnimationF(); }, 250);
			$("#trackerWrapper").animate({
				opacity: 1
			}, 500);
			
			// Start reloading calendar.
			setupMonthsAndDays();
		} else {
			if (active.id !== "") {
				console.log("Starting tracker.");
				playSound("audio/80921__justinbw__buttonchime02up.mp3");
				
				calc 			= new Calc();
				calc.id 		= active.id;
				calc.startDate 	= new Date();
				active.running	= 1;
				
				if (load("settings").gps === 1) {
					navigator.geolocation.getCurrentPosition(function(position) {
						var cor = position.coords.latitude + "," + position.coords.longitude;
						calc.startGps = cor;
					}, onError);
				}
				
				$("#calc").addClass("animationOnce pulse");
				setTimeout(function() {
					$("#calc").removeClass("animationOnce pulse");
				}, 1000);
				
				save("active", active);
				save("calc", calc);
				calc = load("calc");
				startCalc(calc.startDate);
			}
		}
	});
	//alert( JSON.stringify(load("work")[0].calendar[load("work")[0].calendar.length-1]) );
}

// TRACKER GLOBALS.
var calc 			= load("calc");
var work 			= load("work");
var active 			= load("active");
var cD 				= new Date();
var animationI 		= 1;
var animationP		= "left";

// FUNCTIONS
function saveCalcEnd() {
	console.log("Saving stopped tracked data.");
	updateOneItem("active", "running", 0);
	addToArrayIn("work", load("active").id, "calendar", load("calc"));
}

function coinAnimationF() {
	console.log("Animating coins.");
	if (animationI%2 === 0) {
		animationP	= "right";
	} else {
		animationP	= "left";
	}
	animateCoin("#goldCoin"+animationI, animationP);
	animationI++;
	if (animationI == 17) {animationI = 1;}
}
function animateCoin(element, dir) {
	console.log("Animating "+dir+".");
	if (dir == "left") {
		$(element).animate({
			left	: "0%",
			top		: "-500%",	
		}, 0, "easeInOutCirc");
		$(element).animate({
			left	: "49%",
			top		: "-75%",	
		}, 1000, "easeInOutCirc");
		$(element).animate({
			left	: "50%",
			top		: "50%",	
		}, 750, "easeInOutCirc");
	} else if (dir == "right") {
		$(element).animate({
			left	: "100%",
			top		: "-500%",	
		}, 0, "easeInOutCirc");
		$(element).animate({
			left	: "51%",
			top		: "-75%",	
		}, 1000, "easeInOutCirc");
		$(element).animate({
			left	: "50%",
			top		: "50%",	
		}, 750, "easeInOutCirc");
	}
}

// Start and loop calc.
function startCalc(startDate) {
	console.log("Starting accumulator.");
	$("#stampIn").addClass("running");
	$("#tapToStop").show();
	
	startDate 				= new Date(startDate).getTime();
	var active				= load("active");
	var work 				= load("work");
	var payByHour 			= work[active.id].salary;
	var payBySec 			= (payByHour / 60) / 60;
	
	loop = setInterval(function() {		
		var currentDate 	= new Date().getTime();
		var diff 			= (currentDate - startDate) / 1000;
		var earned 			= diff * payBySec;
		
		$("#stampIn").html(earned.toFixed(2));
		calc.accumulator = earned;
	}, 10);
}

$(document).on("tap", "#trackerWrapper", function() { clearInterval(coinAnimation); hideResults(); });
function hideResults() {
	console.log("Hiding results.");
	playSound("audio/80921__justinbw__buttonchime02up.mp3");
	element = $("#trackerWrapper");
	$(element).animate({
		opacity: 0
	}, 500);
	setTimeout(function() {
		$(element).css("z-index", -2);
		$("#monthlySum").addClass("animationOnce pulse");
		$("#monthlyHours").addClass("animationOnce pulse");
		setTimeout(function() {
			updateStatistics();
			$("#monthlySum").removeClass("animationOnce pulse");
			$("#monthlyHours").removeClass("animationOnce pulse");
		}, 1000);
	}, 500);
	animationI 	= 1;
	animationP	= "left";
}