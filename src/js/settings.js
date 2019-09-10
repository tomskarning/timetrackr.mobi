/* SETTINGS. JS */

// ADD
$(document).on("tap", "#add", function() {
	var id 			= load("work").length;
	console.log("Adding work#"+id+".");
	
	if (id <= (maxWorks - 1)) {
		add("work", new Work(id));
		
		reloadWork();
		setActive($("div").find("[data-id='" + load("active").id + "']"));
		
		playSound("audio/80921__justinbw__buttonchime02up.mp3");
		$("#form-group"+id).css({
			opacity: 0,
			left: "100%"
		});
		$("#form-group"+id).animate({
			opacity: 1,
			left: "0%"
		}, 500);
		
		if (id === 0) {
			$(".activate").trigger("tap");
		}
	}
});

// SAVE
$(document).on("focusout", ".firstSettings", function() {
	var type 	= $(this).attr("data-what");
	var id 		= $(this).attr("data-where");
	var value 	= $(this).val();
	console.log("Saving work#"+id+".");
	updateOne("work", id, type, value);
	setActive($("div").find("[data-id='" + load("active").id + "']"));
});

// DELETE
$(document).on("tap", ".delete", function() {
	var id = $(this).attr("data-where");
	var workName = load("work")[id].name;
	console.log("Deleting work#"+id+".");
	
	if (load("settings").language != "en-US") {
		navigator.notification.confirm(
	        languageData.pages.settings.promptText,
	         onConfirm,
	        languageData.pages.settings.promptTitle + " " + workName + "?",
	        [languageData.pages.settings.promptYes, languageData.pages.settings.promptNo]
    	);
	} else {
		navigator.notification.confirm(
	        "Are you sure you want to delete this? Everything logged will be deleted.",
	         onConfirm,
	        "Delete " + workName + "?",
	        ["Yes, delete.", "No, nevermind."]
    	);
	}
	
	function onConfirm(buttonIndex) {
		if (buttonIndex == 1) {
			playSound("audio/136754__ultranova105__shard.mp3");
			$("#form-group"+id).animate({
				opacity: 0,
				left: "100%"
			}, 500, function() {
				delItemInArray("work", id);
				reindexArray("work");
				
				if (load("active").id == id) {
					save("active", new Active(""));
					
					if (load("active").running == 1) {
						updateOneItem("active", "running", 0);
						clearInterval(loop);
					}
				}
				
				updateStatistics();
				reloadWork();
				setActive($("div").find("[data-id='" + load("active").id + "']"));
			});
		}
	}
});

// TRACK
$(document).on("tap", ".activate", function() {
	playSound("audio/107786__leviclaassen__beepbeep.mp3");
	save("active", new Active($(this).attr("data-id")));
	console.log("Tracking work#"+$(this).attr("data-id")+".");
	setActive(this);
});

// Sound
$(document).on("tap", "#sound", function() {
	var settings = load("settings");
	if (settings.sound === 0) {
		settings.sound = 1;
		$("#sound").addClass("settingsOn");
		console.log("Enabled sound.");
	} else {
		settings.sound = 0;
		$("#sound").removeClass("settingsOn");
		console.log("Disabled sound.");
	}
	save("settings", settings);
	playSound("audio/107786__leviclaassen__beepbeep-reverse.mp3");
});

// GPS
$(document).on("tap", "#gps", function() {
	var settings = load("settings");
	if (settings.gps === 0) {
		playSound("audio/107786__leviclaassen__beepbeep.mp3");
		settings.gps = 1;
		navigator.geolocation.getCurrentPosition(onSuccess, onError);
		$("#gps").addClass("settingsOn");
		console.log("Enabled GPS.");
	} else {
		playSound("audio/107786__leviclaassen__beepbeep-reverse.mp3");
		settings.gps = 0;
		$("#gps").removeClass("settingsOn");
		console.log("Disabled GPS.");
	}
	save("settings", settings);
});

// INFO
$(document).on("tap", "#showInfo", function() {
	console.log("Showing info.");
	var hideOn = 1;
	new IScroll("#infoWrapper");
	$("#infoWrapper").css("z-index", 3);
	$("#infoWrapper").animate({
		opacity: 1
	}, 500);
	setTimeout(function() {
		$(document).on("tap", "#infoWrapper", function() {
			if (hideOn == 1) {
				console.log("Hiding info.");
				element = $("#infoWrapper");
				$(element).animate({
					opacity: 0
				}, 500);
				setTimeout(function() {
					$(element).css("z-index", -2);
				}, 500);
				hideOn = 0;
			}
		});
	}, 1000);
});

// GLOBALS
// Setting max works.
var maxWorks	= 3;
if ($(window).height() <= 480) {
	maxWorks	= 2;
} else if ($(window).height() >= 768) {
	maxWorks	= 5;
}
console.log("The screen size "+$(window).height()+" sets max works to "+maxWorks+".");


// FUNCTIONS
var onSuccess = function() {
	return 0;
};

// onError Callback receives a PositionError object
function onError(error) {
    console.log('Error: code: '    + error.code    + '\n' +
          'message: ' + error.message + '\n');
}
function reloadWork() {
	console.log("Reloading work in settings.");
	Handlebars.registerHelper("standardText", function() {
		console.log("No work has been registered.");
		if (load("settings").language != "en-US") {
			return languageData.pages.settings.sStatus;
		} else {
			return "Add work by tapping the pluss sign.";
		}
	});
	
	Handlebars.registerHelper("translateWork", function(word) {
		if (load("settings").language != "en-US") {
			word = word.replace(/\s/g, '').toLowerCase();
			return languageData.pages.settings[word];
		} else {
			return word;
		}
	});
	
	var template 	= Handlebars.templates["work.hbs"];
	var data 		= load("work");
	var output 		= template({work: data});
	$("#work").html(output);
}
function setActive(element) {
	var active 		= load("active");
	var activeId 	= active.id;
	console.log("Setting work#"+activeId+" to active (tracking).");
	if (load("work").length == maxWorks) {
		$("#add").addClass("disabled");
	} else {
		if ($("#add").hasClass("disabled")) {
			$("#add").removeClass("disabled");
		}
	}
	
	if (load("active").id === "") {
		if (load("settings").language != "en-US") {
			$("#activeWork").html(languageData.pages.home.hStatus);
			$("#stampIn").html(languageData.pages.home.start);
		} else {
			$("#activeWork").html("Add a work in the settings.");
			$("#stampIn").html("Start");
		}
		$("#calc").addClass("disabled");
		$("#stampIn").removeClass("running");
		$("#tapToStop").hide();
	} else {
		$(".activate").children("span").addClass("glyphicons-unchecked");
		$(element).children("span").removeClass("glyphicons-unchecked");
		$("#activeWork").html(load("work")[activeId].name);
		$("#calc").removeClass("disabled");
	}
}