// PURCHASES.JS

IAP = {
	list: ["removeAdvertising", "premiumSubscription"]
};

IAP.load = function () {
     // Check availability of the storekit plugin
     if (!window.storekit) {
          console.log("In-App Purchases not available");
          $(".showcaseBuy").html("In-App Purchases not available");
          return;
     }
 
     // Initialize
     storekit.init({
          debug:    true, // Enable IAP messages on the console
          ready:    IAP.onReady,
          purchase: IAP.onPurchase,
          restore:  IAP.onRestore,
          error:    IAP.onError
     });
};

IAP.onReady = function () {
     storekit.load(IAP.list, function (products, invalidIds) {
          IAP.products = products;
          IAP.loaded = true;
          
          for (var i = 0; i < invalidIds.length; ++i) {
               console.log("Error: could not load " + invalidIds[i]);
          }
          
          if (IAP.loaded) {
            var index = 0;
            for (var id in IAP.products) {
            	var p = IAP.products[id];
            	
            	if (p.id == "removeAdvertising") {
            		el = document.getElementById("showcaseAds");
            	} else if (p.id == "premiumSubscription") {
            		el = document.getElementById("showcasePremium");
            	}
            	
                html = "<span class='buyButton' id='buy-" + index + "' productId='" + p.id + "'>" + p.price + "</span>";
                ++index;
                el.innerHTML = html;
            }
            
            while (index > 0) {
                --index;
                document.getElementById("buy-" + index).onclick = function (event) {
                    var pid = this.getAttribute("productId");
                    IAP.buy(pid);
                };
            }
            $(document).on("tap", "#restore", function (event) {
                IAP.restore();
            });
        }
        else {
            $(".showcaseBuy").html("In-App Purchases not available");
        }
	});
};

IAP.onPurchase = function (transactionId, productId, receipt) {
	console.log("purchase: "+transactionId+" "+productId+" "+receipt);
    activate(productId);
};

IAP.onRestore = function (transactionId, productId, transactionReceipt) {
	console.log("RESTORE: "+transactionId+" "+productId+" "+receipt);
    activate(productId);
};

IAP.onError = function (errorCode, errorMessage) {
	 console.log(errorCode);
	 console.log(errorMessage);
};

IAP.buy = function(productId) {
	storekit.purchase(productId);
};

IAP.restore = function() {
    storekit.restore();
};

// CUSTOM FUNCTIONS
function activate(product) {
	console.log('Custom Activating ' + product);
	var settings = load("settings");
	if (product == "removeAdvertising") {
		console.log('Custom Activating IAP: Remove Ads');
    	settings.ads = 0;
    	hideAds();
    	changePage("home");
    } 
    if (product == "premiumSubscription") {
    	console.log('Custom Activating IAP: Premium');
    	settings.ads = 0;
    	settings.premium = 1;
    	hideAds();
    	activatePremium();
    }
    save("settings", settings);
}