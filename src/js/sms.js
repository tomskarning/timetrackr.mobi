function sendSMS(date, startTime, stopTime, workDuration, workPay, gpsMap) {
	console.log("Sending SMS.");
	var number 	= " ";
	var message = "";
	
	if (load("settings").language != "en-US") {
		message  = languageData.exports.header+" "+date+": "+startTime+"-"+stopTime+", "+workDuration+" ("+workPay+").";
		if (gpsMap !== "") {
			message += "\n\n"+languageData.exports.map+":\n"+gpsMap;
		}
		message += "\n\n"+languageData.exports.createdWith+" Timetrackr.mobi, "+languageData.exports.by+" Delirious Ltd.";
	} else {
		message  = "Logged time for "+date+": "+startTime+"-"+stopTime+", "+workDuration+" ("+workPay+").";
		if (gpsMap !== "") {
			message += "\n\nMap:\n"+gpsMap;
		}
		message += "\n\nCreated with Timetrackr.mobi, by Delirious Ltd.";
	}
	
	console.log("going to send: "+message);

	//simple validation for now
	if(message === '') return;

	var msg = {
		phoneNumber:number,
		textMessage:message
	};

	sms.sendMessage(msg, function(message) {
		console.log("success: " + message);
	}, function(error) {
		console.log("error: " + error.code + " " + error.message);
	});
}