/**
 * 
 * KMTrack
 * Custom library for mouse tracking in Javascript
 * 
 * Created by Daniel Gacitua <daniel.gacitua@usach.cl>
 * 
 * License: MIT 
 * http://opensource.org/licenses/MIT
 * 
 * Based on Denis Papathanasiou's buckabuckaboo
 * https://github.com/dpapathanasiou/buckabuckaboo
 * 
 */

import './configs.js';

/**
 * dpapathanasiou: Global variables found in the KMTrack namespace,
 * including the browser window dimensions,
 * calculated using technique from
 * http://andylangton.co.uk/blog/development/get-viewport-size-width-and-height-javascript
 * via http://stackoverflow.com/a/11744120
 *
 * @class vars
 * @constructor
 * @namespace KMTrack
 * @property w window
 * @property d document
 * @property e document element
 * @property g document body
 * @property ping Image object (used to transmit mouse position data to the server)
 * @property srvr url to the 1x1 image used by ping
 * @property navTime navigation start Unix timestamp
 */

KMTrack = {};

KMTrack.vars = {
    w : window,
    d : document 
};

KMTrack.vars.e = KMTrack.vars.d.documentElement;
KMTrack.vars.g = KMTrack.vars.d.getElementsByTagName('body')[0];
KMTrack.vars.ping = new Image();
KMTrack.vars.srvr = null;

// dgacitua: All constants are defined in /app/assets/javascripts/global/config.js
KMTrack.vars.enableTrack = TRACKING_GLOBAL;			// Enable mouse and keyboard tracking
KMTrack.vars.trackMouse = TRACKING_MOUSE;			// Switch for mouse tracking
KMTrack.vars.trackKeyboard = TRACKING_KEYBOARD;		// Switch for keyboard tracking

// dgacitua: Get Unix timestamp
KMTrack.getTimestamp = function() {
	return Date.now ? Date.now() : (new Date().getTime());
};

// dpapathanasiou: Cross-browser event handling, from jresig's blog:
// http://ejohn.org/projects/flexible-javascript-events/
KMTrack.addEvent = function ( obj, type, fn ) {
	if ( obj.attachEvent ) {
		obj['e'+type+fn] = fn;
		obj[type+fn] = function(){obj['e'+type+fn]( KMTrack.vars.w.event );}
		obj.attachEvent( 'on'+type, obj[type+fn] );
	}
	else {
		obj.addEventListener( type, fn, false );
	}
};

// dgacitua: Remove event
KMTrack.removeEvent = function ( obj, type, fn ) {
	if ( obj.detachEvent ) {
		obj.detachEvent( 'on'+type, obj[type+fn] );
		obj[type+fn] = null;
	}
	else {
		obj.removeEventListener( type, fn, false );		
	}
};

// dpapathanasiou: Capture the current mouse position and transmit that info to the server hosting this script,
// only if the mouse's x,y coordinates can be determined, and KMTrack.vars.srvr has been defined
KMTrack.moveListener = function (evt) {
	var time = KMTrack.getTimestamp();

	var x = evt.pageX,
		y = evt.pageY,
		w = KMTrack.vars.w.innerWidth || KMTrack.vars.e.clientWidth || KMTrack.vars.g.clientWidth,
		h = KMTrack.vars.w.innerHeight|| KMTrack.vars.e.clientHeight|| KMTrack.vars.g.clientHeight,
	  src = window.location;	// dgacitua: encodeURIComponent() has been removed

	if (x == null && evt.clientX != null) {
		x = evt.clientX + (KMTrack.vars.e && KMTrack.vars.e.scrollLeft || KMTrack.vars.g && KMTrack.vars.g.scrollLeft || 0)
		- (KMTrack.vars.e && KMTrack.vars.e.clientLeft || KMTrack.vars.g && KMTrack.vars.g.clientLeft || 0);
	}

	if (y == null && evt.clientY != null) {
		y = evt.clientY + (KMTrack.vars.e && KMTrack.vars.e.scrollTop  || KMTrack.vars.g && KMTrack.vars.g.scrollTop  || 0)
		- (KMTrack.vars.e && KMTrack.vars.e.clientTop  || KMTrack.vars.g && KMTrack.vars.g.clientTop  || 0);
	}

	// dgacitua: Output is displayed through Javascript's console and stored on movement_output object
	logToConsole('Mouse Movement! X:' + x + ' Y:' + y + ' W:' + w + ' H:' + h + ' TIME:' + time + ' SRC:' + src);

	var movement_output = {
		type: 'mouse_movement',
		x_pos: x,
		y_pos: y,
		w_scr: w,
		h_scr: h,
		timestamp: time,
		src_url: src
	};
};

// dgacitua: Modified method from moveListener() for registering mouse clicks
KMTrack.clickListener = function (evt) {
	var time = KMTrack.getTimestamp();

	var x = evt.pageX,
	    y = evt.pageY,
	    w = KMTrack.vars.w.innerWidth || KMTrack.vars.e.clientWidth || KMTrack.vars.g.clientWidth,
	    h = KMTrack.vars.w.innerHeight|| KMTrack.vars.e.clientHeight|| KMTrack.vars.g.clientHeight,
	  src = window.location;

	if (x == null && evt.clientX != null) {
		x = evt.clientX + (KMTrack.vars.e && KMTrack.vars.e.scrollLeft || KMTrack.vars.g && KMTrack.vars.g.scrollLeft || 0)
		- (KMTrack.vars.e && KMTrack.vars.e.clientLeft || KMTrack.vars.g && KMTrack.vars.g.clientLeft || 0);
	}

	if (y == null && evt.clientY != null) {
		y = evt.clientY + (KMTrack.vars.e && KMTrack.vars.e.scrollTop  || KMTrack.vars.g && KMTrack.vars.g.scrollTop  || 0)
		- (KMTrack.vars.e && KMTrack.vars.e.clientTop  || KMTrack.vars.g && KMTrack.vars.g.clientTop  || 0);
	}

	// dgacitua: Output is displayed through Javascript's console and stored on click_output object
	logToConsole('Mouse Click! X:' + x + ' Y:' + y + ' W:' + w + ' H:' + h + ' TIME:' + time + ' SRC:' + src);

	var click_output = {
		type: 'mouse_click',
		x_pos: x,
		y_pos: y,
		w_scr: w,
		h_scr: h,
		timestamp: time,
		src_url: src
	};
};

// dgacitua: Listener for key tracking
// Extracted from http://javascript.info/tutorial/keyboard-events
KMTrack.keyListener = function(e) {
	e = e || event;
	
	var t = KMTrack.getTimestamp(),
	   kc = e.keyCode,
	    w = e.which,
	  chc = e.charCode,
	  chr = String.fromCharCode(e.keyCode || e.charCode),
	  src = window.location.href.toString();

	logToConsole('Key Pressed!   ' + 
		' timestamp:' + t + 
		' keyCode:' + kc + 
		' which:' + w + 
		' charCode:' + chc +
		' char:' + chr +
		(e.shiftKey ? ' +SHIFT' : '') +
		(e.ctrlKey ? ' +CTRL' : '') +
		(e.altKey ? ' +ALT' : '') +
		(e.metaKey ? ' +META' : '') +
		' src:' + src
	);

	var key_output = {
		type: 'key_press',
		keyCode: kc,
		which: w,
		charCode: chc,
		chr: chr,
		timestamp: t,
		src_url: src
	};
};

// dpapathanasiou: An initialization function to set the KMTrack.vars.srvr
// value and add the proper event handler for mouse tracking.
//KMTrack.init = function(srvr) {
KMTrack.init = function() {
	KMTrack.vars.w = window;
	KMTrack.vars.d = document;
	KMTrack.vars.e = KMTrack.vars.d.documentElement;
	KMTrack.vars.g = KMTrack.vars.d.getElementsByTagName('body')[0];
	KMTrack.vars.navTime = Date.now();		// Navigation start Unix timestamp

	if (KMTrack.vars.enableTrack && KMTrack.vars.trackMouse) {
		KMTrack.addEvent(KMTrack.vars.g, 'click', KMTrack.clickListener);		// Add event for tracking mouse clicks
		KMTrack.addEvent(KMTrack.vars.g, 'mousemove', KMTrack.moveListener);	// Add event for tracking mouse movements
	}

	if (KMTrack.vars.enableTrack && KMTrack.vars.trackKeyboard) {
		KMTrack.addEvent(KMTrack.vars.w, 'keydown', KMTrack.keyListener);		// Add event for tracking key presses
	}
};

// dgacitua: Stopper function for KMTrack
KMTrack.stop = function() {
	if (KMTrack.vars.enableTrack && KMTrack.vars.trackMouse) {
    	KMTrack.removeEvent(KMTrack.vars.g, 'click', KMTrack.clickListener);		// Remove event for tracking mouse clicks
    	KMTrack.removeEvent(KMTrack.vars.g, 'mousemove', KMTrack.moveListener);		// Remove event for tracking mouse movements
    }

    if (KMTrack.vars.enableTrack && KMTrack.vars.trackKeyboard) {
    	KMTrack.removeEvent(KMTrack.vars.w, 'keydown', KMTrack.keyListener);		// Remove event for tracking key presses
    }
};