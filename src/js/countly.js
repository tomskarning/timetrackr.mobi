function startCountly(appId) {
	console.log("Starting Countly with App ID#"+appId);
	Countly.init("https://cloud.count.ly", appId);
	
	Countly.start();
	console.log("Started Countly with App ID#"+appId);
	
	var events = {"eventName":"Premium","eventCount":1};
	Countly.sendEvent(events);
}