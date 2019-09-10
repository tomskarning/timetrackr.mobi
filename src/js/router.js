/* ROUTER.JS */

// MAIN
$(".navLink").on("tap", function() {
	if (!$(this).hasClass("active")) {
		playSound("audio/185828__lloydevans09__little-thing.mp3");
		$(".navLink").removeClass("active");
		$(this).addClass("active");
		changePage($(this).attr("data-id"));
	}
});

// FUNCTIONS
function changePage(page) {
	console.log("Changing page to '" + page + "'.");
	var language = loadOne("settings", "language");
	
	$(".appViewContent").removeClass("active");
	
	$("#"+page).animate({
	    opacity: 0,
	}, 100, function() {
	   	$("#"+page).animate({
		    opacity: 1,
		}, 100);
		$("#"+page).addClass("active");
	});
	
	if (page == "calendar") {
		loadCalendar();
	}
	
	if (page == "home") {
		if (language == "en-US") {
			$("#headerView").find("h1").html("Timetrackr<span class='appNameEnd'>.mobi</span>");
		} else {
			$("#headerView").find("h1").html(languageData.header.timetrackrMobi);
		}
	} else if (page == "removeAds") {
		if (language == "en-US") {
			$("#headerView").find("h1").html("<span style='color: rgba(192, 192, 192, 1);'>Remove Ads</span>");
		} else {
			$("#headerView").find("h1").html(languageData.header.removeAds);
		}
	} else if (page == "calendar") {
		if (language == "en-US") {
			$("#headerView").find("h1").html("Calendar");
		} else {
			$("#headerView").find("h1").html(languageData.header.calendar);
		}
	} else if (page == "settings") {
		if (language == "en-US") {
			$("#headerView").find("h1").html("Settings");
		} else {
			$("#headerView").find("h1").html(languageData.header.settings);
		}
	} else if (page == "premium") {
		if (language == "en-US") {
			if (load("settings").premium == 1) {
				$("#headerView").find("h1").html("<span style='color: rgba(255, 215, 0, 1);'>You Are Premium</span>");
			} else {
				$("#headerView").find("h1").html("<span style='color: rgba(255, 215, 0, 1);'>Premium Version</span>");
			}
		} else {
			if (load("settings").premium == 1) {
				$("#headerView").find("h1").html(languageData.header.youArePremium);
			} else {
				$("#headerView").find("h1").html(languageData.header.premium);
			}
		}
	}
	console.log("Changed page to '" + page + "'.");
}