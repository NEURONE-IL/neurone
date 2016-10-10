import { Meteor } from 'meteor/meteor';

import '../lib/limit.js';

import Utils from '../loggerUtils';
import LoggerConfigs from '../loggerConfigs';

/**
 * 
 * KMTrack
 * Custom library for mouse tracking in Javascript
 * (adapted as AngularJS Service)
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

export default class KMTrackService {
  constructor($window, $document, $location) {
    'ngInject';

    this.$window = $window;
    this.$document = $document;
    this.$location = $location;

    this.iframeSelected = false;
    this.isTracking = false;

    this.mouseScroll = {
      winX: 0,
      winY: 0,
      docX: 0,
      docY: 0,
      lastScrolledWinX: 0,
      lastScrolledWinY: 0,
      lastScrolledDocX: 0,
      lastScrolledDocY: 0
    }
  }

  bindEvent(evt, data, fn) {
    angular.element(this.$window).on(evt, data, fn);
    Utils.logToConsole('BIND!', evt);
  }

  bindThrottledEvent(evt, data, fn, delay) {
    angular.element(this.$window).on(evt, data, fn.throttle(delay));
    Utils.logToConsole('BIND THROTTLED!', evt, delay);
  }

  unbindEvent(evt, fn) {
    angular.element(this.$window).off(evt, fn);
    Utils.logToConsole('UNBIND!', evt);
  }

  mouseMoveListener(evt) {
    if (Meteor.user() && LoggerConfigs.mouseCoordsLogging) {
      // From http://stackoverflow.com/a/23323821
      var w = evt.data.w,
          d = evt.data.d,
          e = evt.data.e,
          g = evt.data.g,
          w = window.innerWidth  || e.clientWidth  || g.clientWidth,
          h = window.innerHeight || e.clientHeight || g.clientHeight,
        src = window.location.href,   //this.$location.absUrl(),
       time = Utils.getTimestamp();
      /*
      var w = angular.element(window),
          d = angular.element(document),
          e = d[0].documentElement,
          g = d[0].getElementsByTagName('body')[0],
          x = evt.pageX,
          y = evt.pageY,
          w = window.innerWidth  || e.clientWidth  || g.clientWidth,
          h = window.innerHeight || e.clientHeight || g.clientHeight,
        src = window.location.href,   //this.$location.absUrl(),
       time = Utils.getTimestamp();
      */
      
      var docX = evt.pageX,
          docY = evt.pageY,
          winX = evt.clientX,
          winY = evt.clientY,
          docW = d.width(),
          docH = d.height(),
          winW = w,
          winH = h;

      var movement_output = {
        type: 'mouse_movement',
        owner: Meteor.userId(),
        username: Meteor.user().emails[0].address,
        src_url: src,
        x_win: winX,
        y_win: winY,
        w_win: winW,
        h_win: winH,
        x_doc: docX,
        y_doc: docY,
        w_doc: docW,
        h_doc: docH,
        local_time: time
      };

      Utils.logToConsole('Mouse Movement! X:' + winX + ' Y:' + winY + ' W:' + winW + ' H:' + winH + ' docX:' + docX + ' docY:' + docY + ' docW:' + docW + ' docH:' + docH + ' TIME:' + time + ' SRC:' + src);
      Meteor.call('storeMouseCoordinate', movement_output, (err, result) => {});
    }
  }

  mouseClickListener(evt) {
    if (Meteor.user() && LoggerConfigs.mouseClicksLogging) {
      // From http://stackoverflow.com/a/11744120/1319998
      var w = evt.data.w,
          d = evt.data.d,
          e = evt.data.e,
          g = evt.data.g,
          x = evt.pageX,
          y = evt.pageY,
          w = window.innerWidth  || e.clientWidth  || g.clientWidth,
          h = window.innerHeight || e.clientHeight || g.clientHeight,
        src = window.location.href,
       time = Utils.getTimestamp();
      /*
      var w = angular.element(window),
          d = angular.element(document),
          e = d[0].documentElement,
          g = d[0].getElementsByTagName('body')[0],
          x = evt.pageX,
          y = evt.pageY,
          w = window.innerWidth  || e.clientWidth  || g.clientWidth,
          h = window.innerHeight || e.clientHeight || g.clientHeight,
        src = window.location.href,   //this.$location.absUrl(),
       time = Utils.getTimestamp();
      */

      var docX = evt.pageX,
          docY = evt.pageY,
          winX = evt.clientX,
          winY = evt.clientY,
          docW = d.width(),
          docH = d.height(),
          winW = w,
          winH = h;
      
      var click_output = {
        type: 'mouse_click',
        owner: Meteor.userId(),
        username: Meteor.user().emails[0].address,
        src_url: src,
        x_win: winX,
        y_win: winY,
        w_win: winW,
        h_win: winH,
        x_doc: docX,
        y_doc: docY,
        w_doc: docW,
        h_doc: docH,
        local_time: time
      };

      Utils.logToConsole('Mouse Click! X:' + winX + ' Y:' + winY + ' W:' + winW + ' H:' + winH + ' docX:' + docX + ' docY:' + docY + ' docW:' + docW + ' docH:' + docH + ' TIME:' + time + ' SRC:' + src);
      Meteor.call('storeMouseClick', click_output, (err, result) => {});
    }
  }

  scrollListener(evt) {
    if (Meteor.user() && LoggerConfigs.mouseCoordsLogging) {
      // From http://stackoverflow.com/a/23323821
      var w = evt.data.w,
          d = evt.data.d,
          e = evt.data.e,
          g = evt.data.g,
          w = window.innerWidth  || e.clientWidth  || g.clientWidth,
          h = window.innerHeight || e.clientHeight || g.clientHeight,
        src = window.location.href,
       time = Utils.getTimestamp();
      
      var scrollX = window.scrollX,
          scrollY = window.scrollY,
          docW = d.width(),
          docH = d.height(),
          winW = w,
          winH = h;

      var movement_output = {
        type: 'scroll',
        owner: Meteor.userId(),
        username: Meteor.user().emails[0].address,
        src_url: src,
        x_scr: scrollX,
        y_scr: scrollY,
        w_win: winW,
        h_win: winH,
        w_doc: docW,
        h_doc: docH,
        local_time: time
      };


      Utils.logToConsole('Scroll Movement! scrX:' + scrollX + ' scrY:' + scrollY + ' W:' + winW + ' H:' + winH + ' docW:' + docW + ' docH:' + docH + ' TIME:' + time + ' SRC:' + src);
      Meteor.call('storeScrollMove', movement_output, (err, result) => {});
    }
  }

  keystrokeListener(evt) {
    evt = evt || event;
      
    var t = Utils.getTimestamp(),
       kc = evt.keyCode,
        w = evt.which,
      chc = evt.charCode,
      chr = String.fromCharCode(kc || chc),
      src = window.location.href;
    //cond = ((kc >= 8 && kc <= 46) || (kc >= 91 && kc <= 93) || (kc >= 106 && kc <= 222)) ? true : false;

    if (Meteor.user() && LoggerConfigs.keyboardLogging) {
      Utils.logToConsole('Keydown!   ' + 
        ' timestamp:' + t + 
        ' keyCode:' + kc + 
        ' which:' + w + 
        ' charCode:' + chc +
        ' char:' + chr +
        (evt.shiftKey ? ' +SHIFT' : '') +
        (evt.ctrlKey ? ' +CTRL' : '') +
        (evt.altKey ? ' +ALT' : '') +
        (evt.metaKey ? ' +META' : '') +
        ' src:' + src
      );

      var key_output = {
        type: 'key_down',
        keyCode: kc,
        which: w,
        charCode: chc,
        chr: chr,
        local_time: t,
        src_url: src,
        owner: Meteor.userId(),
        username: Meteor.user().emails[0].address
      };

      Meteor.call('storeKeystroke', key_output, (err, result) => {});
    }
  }

  keycharListener(evt) {
    evt = evt || event;
      
    var t = Utils.getTimestamp(),
       kc = evt.keyCode,
        w = evt.which,
      chc = evt.charCode,
      chr = String.fromCharCode(kc || chc),
      src = window.location.href;
     //cond = ((kc >= 48 && kc <= 57) || (kc >= 65 && kc <= 90)) ? true : false;

    if (Meteor.user() && LoggerConfigs.keyboardLogging) {
      Utils.logToConsole('Keypress!   ' + 
        ' timestamp:' + t + 
        ' keyCode:' + kc + 
        ' which:' + w + 
        ' charCode:' + chc +
        ' char:' + chr +
        (evt.shiftKey ? ' +SHIFT' : '') +
        (evt.ctrlKey ? ' +CTRL' : '') +
        (evt.altKey ? ' +ALT' : '') +
        (evt.metaKey ? ' +META' : '') +
        ' src:' + src
      );

      var key_output = {
        type: 'key_press',
        keyCode: kc,
        which: w,
        charCode: chc,
        chr: chr,
        local_time: t,
        src_url: src,
        owner: Meteor.userId(),
        username: Meteor.user().emails[0].address
      };

      Meteor.call('storeKeystroke', key_output, (err, result) => {});
    }
  }

  startTrack() {
    var data = {
      w: angular.element(window),
      d: angular.element(document),
      e: angular.element(document)[0].documentElement,
      g: angular.element(document)[0].getElementsByTagName('body')[0]
    };

    this.bindThrottledEvent('mousemove', data, this.mouseMoveListener, LoggerConfigs.eventThrottle);
    this.bindThrottledEvent('scroll', data, this.scrollListener, LoggerConfigs.eventThrottle);
    this.bindEvent('click', data, this.mouseClickListener);
    this.bindEvent('keydown', data, this.keystrokeListener);
    this.bindEvent('keypress', data, this.keycharListener);

    this.isTracking = true;
  }

  stopTrack() {
    this.unbindEvent('mousemove', this.mouseMoveListener);
    this.unbindEvent('scroll', this.scrollListener);
    this.unbindEvent('click', this.mouseClickListener);
    this.unbindEvent('keydown', this.keystrokeListener);
    this.unbindEvent('keypress', this.keycharListener);

    this.isTracking = false;
  }

  service() {
    if (!this.isTracking) {
      this.startTrack();
    }
  }

  antiService() {
    if (this.isTracking) {
      this.stopTrack();
    }
  }
}