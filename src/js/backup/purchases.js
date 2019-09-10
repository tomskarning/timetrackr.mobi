// PURCHASES.JS

function initIAP() {
	console.log('Running initIAP().');
	IAP.initialize();
    IAP.render = function () {
    	console.log('Running IAP.render().');
    	var html;
        var el;
        
        if (IAP.loaded) {
            var index = 0;
            for (var id in IAP.products) {
            	var p = IAP.products[id];
            	
            	if (p.title == "Remove Ads") {
            		el = document.getElementById("showcaseAds");
            	} else if (p.title == "Premium Membership") {
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
    };
}

var IAP = {
    list: [ 'removeads', 'premium' ],
    products: {}
};
var localStorage = window.localStorage || {};

IAP.initialize = function () {
	console.log('Running IAP.initialize().');
    // Check availability of the storekit plugin
    if (!window.storekit) {
        console.log('In-App Purchases not available');
        return;
    }

    // Initialize
    storekit.init({
        debug:    true,
        noAutoFinish: true,
        ready:    IAP.onReady,
        purchase: IAP.onPurchase,
        finish:   IAP.onFinish,
        restore:  IAP.onRestore,
        error:    IAP.onError,
        restoreCompleted: IAP.onRestoreCompleted
    });
};

IAP.onReady = function () {
	console.log('Running IAP.onReady().');
    // Once setup is done, load all product data.
    storekit.load(IAP.list, function (products, invalidIds) {
        console.log('IAPs loading done:');
        for (var j = 0; j < products.length; ++j) {
            var p = products[j];
            console.log('Loaded IAP(' + j + '). title:' + p.title +
                        ' description:' + p.description +
                        ' price:' + p.price +
                        ' id:' + p.id);
            IAP.products[p.id] = p;
        }
        IAP.loaded = true;
        for (var i = 0; i < invalidIds.length; ++i) {
            console.log('Error: could not load ' + invalidIds[i]);
        }
        IAP.render();
    });

    // Also check the receipts
    storekit.loadReceipts(function (receipts) {
        console.log('appStoreReceipt: ' + receipts.appStoreReceipt);
    });
};

IAP.onPurchase = function (transactionId, productId) {
	console.log('Running IAP.onPurchase().');
    var n = (localStorage['storekit.' + productId]|0) + 1;
    localStorage['storekit.' + productId] = n;
    if (IAP.purchaseCallback) {
        IAP.purchaseCallback(productId);
        delete IAP.purchaseCallback;
    }

    storekit.finish(transactionId);

    storekit.loadReceipts(function (receipts) {
        console.log('Receipt for appStore = ' + receipts.appStoreReceipt);
        console.log('Receipt for ' + productId + ' = ' + receipts.forProduct(productId));
    });
};

IAP.onFinish = function (transactionId, productId) {
	alert(productId);
	console.log('Running IAP.onFinish().');
    console.log('Finished transaction for ' + productId + ' : ' + transactionId);
    //activate(productId);
};

IAP.onError = function (errorCode, errorMessage) {
	console.log('Error: ' + errorMessage);
};

IAP.onRestore = function (transactionId, productId) {
    console.log("Restored: " + productId);
    var n = (localStorage['storekit.' + productId]|0) + 1;
    localStorage['storekit.' + productId] = n;
    activate(productId);
};

IAP.onRestoreCompleted = function () {
    console.log("Restore Completed");
};

IAP.buy = function (productId, callback) {
	console.log('Running IAP.buy().');
    IAP.purchaseCallback = callback;
    storekit.purchase(productId);
};

IAP.restore = function () {
	console.log('Running IAP.restore().');
    storekit.restore();
};

IAP.fullVersion = function () {
	console.log('Running IAP.fullVersion().');
    return localStorage['storekit.mobi.delirious.timetrackr'];
};


// CUSTOM FUNCTIONS
function activate(product) {
	console.log('Custom Activating ' + product);
	var settings = load("settings");
	if (product == "removeads") {
		console.log('Custom Activating IAP: Remove Ads');
    	settings.ads = 0;
    	hideAds();
    	changePage("home");
    } else if (product == "premium") {
    	console.log('Custom Activating IAP: Premium');
    	settings.ads = 0;
    	settings.premium = 1;
    	hideAds();
    	activatePremium();
    }
    save("settings", settings);
}