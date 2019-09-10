/* MAIN.JS */
var languageData = "";

$(document).ready(function() {
	console.log("Document Ready!");
	
	console.log("Adding EventListener 'deviceready'.");
	document.addEventListener("deviceready", onDeviceReady, false);
	
	// Setup settings item
	console.log("Setting up settings.");
	if (!load("settings")) {
		console.log("First run.");
		save("settings", new Settings());
		console.log("Created 'settings' in localstorage.");
	}
	
	// Language.
	checkLanguage();
});

function onDeviceReady() {
	console.log("Device Ready!");
	
	setTimeout(function() {
		setTimeout(function() {
	    	console.log("Hiding splashscreen.");
	        $.when(navigator.splashscreen.hide()).done(function() {
				console.log("Hid splashscreen.");
			});
	    }, 100);
		
		// Ads
		console.log("Setting up ads.");
		if (loadOne("settings", "ads") == 1) {
			console.log("Ads is turned on.");
			//showAds();
		} else {
			console.log("Ads is turned off.");
			//hideAds();
		}
		
		// Sounds
		console.log("Setting up sounds.");
		if (loadOne("settings", "sound") == 1) {
			console.log("Sounds is turned on.");
			$("#sound").addClass("settingsOn");
		} else {
			console.log("Sounds is turned off.");
			$("#sound").removeClass("settingsOn");
		}
		
		// GPS
		console.log("Setting up GPS.");
		if (loadOne("settings", "gps") == 1) {
			console.log("GPS is turned on.");
			$("#gps").addClass("settingsOn");
		} else {
			console.log("GPS is turned off");
			$("#gps").removeClass("settingsOn");
		}
		
		// Premium
		console.log("Setting up premium.");
		if (loadOne("settings", "premium") == 1) {
			console.log("Premium is turned on.");
			activatePremium();
			//hideAds();
		} else {
			console.log("Premium is turned off.");
		}
		
		// Setup work array
		if (!load("work")) {
			console.log("Setting up new work array in localstorage.");
			save("work", []);
		} reloadWork();
		
		// Setup active item
		if (!load("active")) {
			console.log("Setting up new active object in localstorage.");
			save("active", new Active(""));
		} if (load("active") !== "") {
			console.log("Active object found in localstorage, activating.");
			setActive($("div").find("[data-id='" + load("active").id + "']"));
		}
		
		// Show contents.
		changePage("home");
		
		// Setup statistics.
		startStatistics();
		
		// Checking tracker.
		checkTrackerStatus();
		
		// Setup calendar.
		loadCalendar();
	    
		// Time Convention.
		checkTimeConvention();
		
	    // Countly.
	    startCountly("f55c4f7fe06bf105dea83160f086f012b781af35");
	    
	    console.log("Setup Done.");
	}, 500);
}

// DATA
function Work(id) {
	this.id				= id;
	this.name			= "";
	this.salary			= "";
	this.calendar		= [];
}
function Active(id) {
	this.id 			= id;
	this.running		= 0;
}
function Calc() {
	this.id				= "";
	this.salary			= "";
	this.startDate  	= "";
	this.startGps	  	= "";
	this.stopDate		= "";
	this.stopGps		= "";
	this.accumulator	= 0;
}
function Settings() {
	this.gps			= 0;
	this.timeConvention	= 24;
	this.language		= "en-US";
	this.languageData	= "";
	this.sound			= 0;
	this.ads			= 0;
	this.premium		= 1;
}

// FUNCTIONS TO MANIPULATE LOCALSTORAGE
function save(name, data) {
	localStorage.setItem(name, JSON.stringify(data));
	console.log("Saved "+JSON.stringify(data)+" to "+name+".");
}
function load(name) {
	console.log("Loaded "+localStorage.getItem(name)+" from "+name+".");
	return JSON.parse(localStorage.getItem(name));
}
function loadOne(name, data) {
	console.log("Loaded '"+data+"': "+JSON.parse(localStorage.getItem(name))[data]+" from "+name+".");
	return JSON.parse(localStorage.getItem(name))[data];
}
function del(name) {
	localStorage.removeItem(name);
	console.log("Deleted "+name+" from localstorage.");
}
function delItemInArray(name, index) {
	var array = load(name);
	array.splice(index, 1);
	save(name, array);
	console.log("Deleted "+index+" from "+name+".");
}
function updateOneItem(name, data, value) {
	var update = load(name);
	update[data] = value;
	save(name, update);
	console.log("Updated "+data+" in "+name+" with "+value+".");
}
function updateOne(name, num, data, value) {
	var update = load(name);
	update[num][data] = value;
	save(name, update);
	console.log("Updated "+data+" at "+num+" in "+name+" with "+value+".");
}
function add(name, value) {
	var update = load(name);
	update.push(value);
	save(name, update);
	console.log("Added "+value+" to "+name+".");
}
function addToArrayIn(name, num, data, value) {
	var update = load(name);
	update[num][data].push(value);
	save(name, update);
	console.log("Added "+value+" at "+num+" in "+name+"'s "+data+".");
}
function reindexArray(name) {
	console.log("Reindexing work array in localstorage.");
	var array = load(name);
	for (var i = 0; i <= (array.length - 1); i++) {
		array[i].id = i;
	}
	save("work", array);	
}

// DIVERGENT FUNCTIONS
function monthNumToStr(month) {
	console.log("Converting month#"+month+" to string.");
	if (month === 0) {
		return "January";
	} else if (month == 1) {
		return "February";
	} else if (month == 2) {
		return "March";
	} else if (month == 3) {
		return "April";
	} else if (month == 4) {
		return "May";
	} else if (month == 5) {
		return "June";
	} else if (month == 6) {
		return "July";
	} else if (month == 7) {
		return "August";
	} else if (month == 8) {
		return "September";
	} else if (month == 9) {
		return "October";
	} else if (month == 10) {
		return "November";
	} else if (month == 11) {
		return "December";
	}
}
function dayNumToShortStr(day) {
	console.log("Converting "+day+" to short string.");
	if (day === 0) {
		return "Sun";
	} else if (day == 1) {
		return "Mon";
	} else if (day == 2) {
		return "Tue";
	} else if (day == 3) {
		return "Wed";
	} else if (day == 4) {
		return "Thu";
	} else if (day == 5) {
		return "Fri";
	} else if (day == 6) {
		return "Sat";
	}
}
function daysInMonth(month,year) {
	console.log("Finding number of days in "+month+". "+year+".");
    return new Date(year, month, 0).getDate();
}
function playSound(sound) {
	if (loadOne("settings", "sound") == 1) {
		console.log("Playing '" + sound + "'.");
	    var media = new Audio(sound);
		$.when(media.play()).done(function() {
			console.log("Played '" + sound + "'.");
		});
	}
}
function checkTimeConvention() {
	console.log("Checking time convention.");
	function success(message) {
		if (message === false) {
			updateOneItem("settings", "timeConvention", 12);
			console.log("Time convention is 12 hours.");
		} else if (message === true) {
			updateOneItem("settings", "timeConvention", 24);
			console.log("Time convention is 24 hours.");
		}
	}
	
    function failure() {
        console.log("Error checking time convention.");
    }
    
    hello.greet("World", success, failure);
}

function formatAMPM(date) {
	console.log("Converting "+date+" to AM/PM.");
	var hours = date.getHours();
	var minutes = date.getMinutes();
	var ampm = hours >= 12 ? 'pm' : 'am';
	hours = hours % 12;
	hours = hours ? hours : 12; // the hour '0' should be '12'
	minutes = minutes < 10 ? '0'+minutes : minutes;
	var strTime = hours + ':' + minutes + '' + ampm;
	return strTime;
}
