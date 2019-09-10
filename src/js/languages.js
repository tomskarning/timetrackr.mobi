// Main.
function checkLanguage() {
	console.log("Checking language.");
	navigator.globalization.getPreferredLanguage(
	    function(language) {
	    	if (language.value == "nb-NO") {
	    		console.log("Language is 'nb-NO'.");
	    		updateOneItem("settings", "language", language.value);
	    		activateLanguage("nb-NO");
    		} else {
    			console.log("Language is 'en-US'.");
    			updateOneItem("settings", "language", "en-US");
    			activateLanguage("en-US");
    		}
    	},
	    function() {
	    	console.log("Error getting language.");
    	}
	);
}

// Functions.
function activateLanguage(lang) {
	console.log("Activating " + lang + ".");
	// Get JSON language file.
	if (lang != "en-US") {
		$.ajax({
		  url: "json/"+lang+".json",
		  method: "GET",
		  dataType: "json",
		  cache: true,
		  async: false,
		  success: function (data) {
		  	updateOneItem("settings", "languageData", data);
		  }
		});
		
		mainTranslator();
	}
}
function mainTranslator() {
	languageData = loadOne("settings", "languageData");
	console.log("Translating.");
	// Footer.
	$("#removeAdsLabel").html(languageData.footer.removeAds);
	$("#premiumLabel").html(languageData.footer.premium);
	
	// Remove Ads.
	$("#removeAdsHeader").html(languageData.pages.removeAds.header);
	$("#removeAdsText").html(languageData.pages.removeAds.text);
	
	// Calendar.
	$("#prevMonthText").html(languageData.pages.calendar.previous);
	$("#currentMonthText").html(languageData.pages.calendar.current);
	$("#nextMonthText").html(languageData.pages.calendar.next);
	
	// Home.
	$("#stampIn").html(languageData.pages.home.start);
	$("#tapToStop").html(languageData.pages.home.tapToStop);
	
	// Settings.
	$("#restoreText").html(languageData.pages.settings.restore);
	
	// Premium.
	$("#premiumHeader1").html(languageData.pages.premium.header1);
	$("#premiumText1").html(languageData.pages.premium.text1);
	$("#premiumHeader2").html(languageData.pages.premium.header2);
	$("#premiumText2").html(languageData.pages.premium.text2);
	$("#premiumHeader3").html(languageData.pages.premium.header3);
	$("#premiumText3").html(languageData.pages.premium.text3);
	$("#premiumHeader4").html(languageData.pages.premium.header4);
	$("#premiumText4").html(languageData.pages.premium.text4);
	$("#premiumBuyImage").attr("src", languageData.pages.premium.imageSrc);
	$("#premiumBuyImage").attr("alt", languageData.pages.premium.imageAlt);
	
	// Tracker.
	$("#trackerHeader").html(languageData.wrappers.tracker.header);
	$("#trackerText1").html(languageData.wrappers.tracker.text1);
	$("#trackerText2").html(languageData.wrappers.tracker.text2);
	
	// Info.
	$("#infoHeader").html(languageData.wrappers.info.header1);
	$("#allRightsReserved").html(languageData.wrappers.info.allRightsReserved);
	$("#attributions").html(languageData.wrappers.info.attributions);
	$("#audio").html(languageData.wrappers.info.audio);
	$(".by").html(languageData.wrappers.info.by);
	$(".licencedUnder").html(languageData.wrappers.info.licencedUnder);
}

function translateMonth(month) {
	console.log("Translating month: "+month);
	if (load("settings").language != "en-US") {
		return languageData.pages.calendar.months[month.toLowerCase()];
	} else {
		return month;
	}
}

function translateDay(day) {
	console.log("Translating day: "+day);
	if (load("settings").language != "en-US") {
		return languageData.pages.calendar.weekdays[day.toLowerCase()];
	} else {
		return day;
	}
}