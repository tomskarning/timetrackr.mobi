function sendEmail(date, startTime, stopTime, workDuration, workPay, gpsMap) {
	console.log("Sending email.");
	var subject = "";
	var body 	= "";
	
	if (load("settings").language != "en-US") {
		subject = languageData.exports.header+" "+date;
		body 		= "<!DOCTYPE html><html><head><meta http-equiv='content-type' content='text/html; charset=UTF-8'></head><body>";
		body		= "<h1>"+languageData.exports.header+" "+date+".</h1><h3>"+startTime+"-"+stopTime+": "+workDuration+" ("+workPay+").</h3>";
		if (gpsMap !== "") {
			//body   += "<img style='width: 100%;' alt='GPS "+languageData.exports.map+"' src='"+gpsMap+"' /><br /><br />";
			body   += "<a target='_blank' href='"+gpsMap+"'>"+languageData.exports.map+"</a><br /><br />";
		}
		body   	   += "<i>"+languageData.exports.createdWith+" <b><a target='_blank' href='http://timetrackr.mobi/'>Timetrackr.mobi</a></b>, "+languageData.exports.by+" Delirious Ltd.</i>";
		body	   += "</body></html>";
	} else {
		subject 	= "Logged time for "+date;
		body 		= "<!DOCTYPE html><html><head><meta http-equiv='content-type' content='text/html; charset=UTF-8'></head><body>";
		body	   += "<h1>Logged time for "+date+".</h1><h3>"+startTime+"-"+stopTime+": "+workDuration+" ("+workPay+").</h3>";
		if (gpsMap !== "") {
			//body   += "<img style='width: 100%;' alt='GPS Map' src='"+gpsMap+"' /><br />"+gpsMap+"<br />";
			body   += "<a target='_blank' href='"+gpsMap+"'>Map</a><br /><br />";
		}
		body   	   += "<i>Created with <b><a target='_blank' href='http://timetrackr.mobi/'>Timetrackr.mobi</a></b>, by Delirious Ltd.</i>";
		body	   += "</body></html>";
	}
	
	cordova.plugins.email.open({
	    to		: '',
	    subject	: subject,
	    body	: body,
	    isHtml	: true
	});
}

function sendEmailCsv(csv) {
	console.log("Exporting data.");
	csv = btoa(csv);
	var subject 	= "";
	var body 		= "";
	var attachments = null;
	
	if (load("settings").language != "en-US") {
		subject 	= languageData.exports.csv.header;
		body		= languageData.exports.csv.text+"<br /><br />";
		body   	   += "<i>Loggført med <b><a target='_blank' href='http://timetrackr.mobi'>Timetrackr.mobi</a></b>, av Delirious Ltd.</i>";
		attachments = "base64:Timetrackr Logger - "+new Date()+".csv//"+csv;
	} else {
		subject 	= "Timetracker.mobi Logs";
		body		= "Attached is a CSV file which contains all logged data.<br /><br />";
		body   	   += "<i>"+languageData.exports.createdWith+" <b><a target='_blank' href='http://timetrackr.mobi'>Timetrackr.mobi</a></b>, "+languageData.exports.by+" Delirious Ltd.</i>";
		attachments = "base64:"+languageData.exports.csv.file+" - "+new Date()+".csv//"+csv;
	}
	cordova.plugins.email.open({
	    to			: '',
	    subject		: subject,
	    body		: body,
	    isHtml		: true,
	    attachments	: attachments
	});
}