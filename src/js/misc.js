// MISC.JS

// A jQuery plugin to selectively disable the iOS double-tap-to-zoom action on specific page elements (and have that generate two click events instead).
// https://gist.github.com/johan/2047491
$(document).ready(function() {
  var IS_IOS = /iphone|ipad/i.test(navigator.userAgent);
  $.fn.nodoubletapzoom = function() {
    if (IS_IOS)
      $(this).bind('touchstart', function preventZoom(e) {
        var t2 = e.timeStamp,
        	t1 = $(this).data('lastTouch') || t2,
        	dt = t2 - t1,
        	fingers = e.originalEvent.touches.length;
        $(this).data('lastTouch', t2);
        if (!dt || dt > 500 || fingers > 1) return; // not double-tap

        e.preventDefault(); // double tap - prevent the zoom
        // also synthesize click events we just swallowed up
        $(this).trigger('click').trigger('click');
      });
  };
  $("body").nodoubletapzoom();
});

// Fixes inputs overbounds clicking.
/*$(document).on('tap', '.settingsExtras', function(e) {
	$("input").prop("disabled", true);
	setTimeout(function() { $("input").prop("disabled", false); }, 500);
});*/

// Opens links in Safari.
// http://stackoverflow.com/questions/9746260/how-can-i-open-an-external-link-in-safari-not-the-apps-uiwebview
$(document).on('tap', 'a[target="_blank"]', function(ev) {
	var url;
	ev.preventDefault();
	url = $(this).attr('href');
	console.log("JS:" + url);
	var success = function(winParam) {};
	var failure = function(error) {};
	cordova.exec(success, failure, "Safari", "openExternally", [url]);
});

// Disable entire page scroll on touch screens.
$(document).ready(function() {
	document.body.addEventListener('touchmove', function(event) {
		console.log(event.source);
		//if (event.source == document.body)
		event.preventDefault();
	}, false);
	window.onresize = function() {
		$(document.body).width(window.innerWidth).height(window.innerHeight);
	};
	$(function() {
		window.onresize();
	});
});

// Prevent webview push ups by input focus.
// http://stackoverflow.com/questions/13820088/how-to-prevent-keyboard-push-up-webview-at-ios-app-using-phonegap
$(document).on('focusout', 'input', function(e) {
    e.preventDefault(); e.stopPropagation();
    window.scrollTo(0,0);
});
$(document).on('focus', 'input', function(e) {
    e.preventDefault(); e.stopPropagation();
    window.scrollTo(0,0);
});

// Prevent links in standalone web apps opening Mobile Safari.
// https://gist.github.com/kylebarrow/1042026
/*(function(document,navigator,standalone) {
            // prevents links from apps from oppening in mobile safari
            // this javascript must be the first script in your <head>
            if ((standalone in navigator) && navigator[standalone]) {
                var curnode, location=document.location, stop=/^(a|html)$/i;
                document.addEventListener('click', function(e) {
                curnode=e.target;
            while (!(stop).test(curnode.nodeName)) {
                curnode=curnode.parentNode;
            }
            // Condidions to do this only on links to your own app
            // if you want all links, use if('href' in curnode) instead.
            if('href' in curnode && ( curnode.href.indexOf('http') || ~curnode.href.indexOf(location.host) ) ) {
                e.preventDefault();
                location.href = curnode.href;
            }
        },false);
    }
})(document,window.navigator,'standalone');*/
