import { Meteor } from 'meteor/meteor';

import '../../../lib/limit';

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
  constructor($window, $document, $state) {
    'ngInject';

    this.$window = $window;
    this.$document = $document;
    this.$state = $state;

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
    if (!!Meteor.userId() && LoggerConfigs.mouseCoordsLogging) {
      // From http://stackoverflow.com/a/23323821
      var w = evt.data.w,
          d = evt.data.d,
          e = evt.data.e,
          g = evt.data.g,
          w = window.innerWidth  || e.clientWidth  || g.clientWidth,
          h = window.innerHeight || e.clientHeight || g.clientHeight,
          s = evt.data.s,
        src = s.href(s.current.name, s.params, {absolute: false}),
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
        src = window.location.href,
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

      var movementOutput = {
        userId: Meteor.userId(),
        username: Meteor.user().username || Meteor.user().emails[0].address,
        type: 'mouseMovement',
        url: src,
        x_win: winX,
        y_win: winY,
        w_win: winW,
        h_win: winH,
        x_doc: docX,
        y_doc: docY,
        w_doc: docW,
        h_doc: docH,
        localTimestamp: time
      };

      Utils.logToConsole('Mouse Movement!', 'X:' + winX + ' Y:' + winY + ' W:' + winW + ' H:' + winH + ' docX:' + docX + ' docY:' + docY + ' docW:' + docW + ' docH:' + docH + ' TIME:' + time + ' SRC:' + src);
      Meteor.call('storeMouseCoordinate', movementOutput, function(err, result) {});
    }
  }

  mouseClickListener(evt) {
    if (!!Meteor.userId() && LoggerConfigs.mouseClicksLogging) {
      // From http://stackoverflow.com/a/11744120/1319998
      var w = evt.data.w,
          d = evt.data.d,
          e = evt.data.e,
          g = evt.data.g,
          x = evt.pageX,
          y = evt.pageY,
          w = window.innerWidth  || e.clientWidth  || g.clientWidth,
          h = window.innerHeight || e.clientHeight || g.clientHeight,
          s = evt.data.s,
        src = s.href(s.current.name, s.params, {absolute: false}),
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
        src = window.location.href,
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
      
      var clickOutput = {
        userId: Meteor.userId(),
        username: Meteor.user().username || Meteor.user().emails[0].address,
        type: 'mouseClick',
        url: src,
        x_win: winX,
        y_win: winY,
        w_win: winW,
        h_win: winH,
        x_doc: docX,
        y_doc: docY,
        w_doc: docW,
        h_doc: docH,
        localTimestamp: time
      };

      Utils.logToConsole('Mouse Click!', 'X:' + winX + ' Y:' + winY + ' W:' + winW + ' H:' + winH + ' docX:' + docX + ' docY:' + docY + ' docW:' + docW + ' docH:' + docH + ' TIME:' + time + ' SRC:' + src);
      Meteor.call('storeMouseClick', clickOutput, function(err, result) {});
    }
  }

  scrollListener(evt) {
    if (!!Meteor.userId() && LoggerConfigs.mouseCoordsLogging) {
      // From http://stackoverflow.com/a/23323821
      var w = evt.data.w,
          d = evt.data.d,
          e = evt.data.e,
          g = evt.data.g,
          w = window.innerWidth  || e.clientWidth  || g.clientWidth,
          h = window.innerHeight || e.clientHeight || g.clientHeight,
          s = evt.data.s,
        src = s.href(s.current.name, s.params, {absolute: false}),
       time = Utils.getTimestamp();
      
      var scrollX = window.scrollX,
          scrollY = window.scrollY,
          docW = d.width(),
          docH = d.height(),
          winW = w,
          winH = h;

      var scrollOutput = {
        userId: Meteor.userId(),
        username: Meteor.user().username || Meteor.user().emails[0].address,
        type: 'scroll',
        url: src,
        x_scr: scrollX,
        y_scr: scrollY,
        w_win: winW,
        h_win: winH,
        w_doc: docW,
        h_doc: docH,
        localTimestamp: time
      };

      Utils.logToConsole('Scroll Movement!', 'scrX:' + scrollX + ' scrY:' + scrollY + ' W:' + winW + ' H:' + winH + ' docW:' + docW + ' docH:' + docH + ' TIME:' + time + ' SRC:' + src);
      Meteor.call('storeScrollMove', scrollOutput, (err, result) => {});
    }
  }

  keydownListener(evt) {
    evt = evt || event;
      
    var t = Utils.getTimestamp(),
       kc = evt.keyCode,
        w = evt.which,
      chc = evt.charCode,
      chr = String.fromCharCode(kc || chc),
        s = evt.data.s,
      src = s.href(s.current.name, s.params, {absolute: false});
    //cond = ((kc >= 8 && kc <= 46) || (kc >= 91 && kc <= 93) || (kc >= 106 && kc <= 222)) ? true : false;

    if (!!Meteor.userId() && LoggerConfigs.keyboardLogging) {
      var keyOutput = {
        userId: Meteor.userId(),
        username: Meteor.user().username || Meteor.user().emails[0].address,
        type: 'keyDown',
        keyCode: kc,
        which: w,
        charCode: chc,
        chr: chr,
        localTimestamp: t,
        url: src
      };

      Utils.logToConsole('Key Pressed!', 
        'timestamp:' + t + 
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

      Meteor.call('storeKeystroke', keyOutput, function(err, result) {});
    }
  }

  keypressListener(evt) {
    evt = evt || event;
      
    var t = Utils.getTimestamp(),
       kc = evt.keyCode,
        w = evt.which,
      chc = evt.charCode,
      chr = String.fromCharCode(kc || chc),
        s = evt.data.s,
      src = s.href(s.current.name, s.params, {absolute: false});
     //cond = ((kc >= 48 && kc <= 57) || (kc >= 65 && kc <= 90)) ? true : false;

    if (!!Meteor.userId() && LoggerConfigs.keyboardLogging) {
      var key_output = {
        userId: Meteor.userId(),
        username: Meteor.user().username || Meteor.user().emails[0].address,
        type: 'keyPress',
        keyCode: kc,
        which: w,
        charCode: chc,
        chr: chr,
        localTimestamp: t,
        url: src
      };

      Utils.logToConsole('Key Pressed!',
        'timestamp:' + t + 
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

      Meteor.call('storeKeystroke', key_output, function(err, result) {});
    }
  }

  startTrack() {
    var data = {
      w: angular.element(window),
      d: angular.element(document),
      e: angular.element(document)[0].documentElement,
      g: angular.element(document)[0].getElementsByTagName('body')[0],
      s: this.$state
    };

    this.bindThrottledEvent('mousemove', data, this.mouseMoveListener, LoggerConfigs.eventThrottle);
    this.bindThrottledEvent('scroll', data, this.scrollListener, LoggerConfigs.eventThrottle);
    this.bindEvent('click', data, this.mouseClickListener);
    this.bindEvent('keydown', data, this.keydownListener);
    this.bindEvent('keypress', data, this.keypressListener);

    this.isTracking = true;
  }

  stopTrack() {
    this.unbindEvent('mousemove', this.mouseMoveListener);
    this.unbindEvent('scroll', this.scrollListener);
    this.unbindEvent('click', this.mouseClickListener);
    this.unbindEvent('keydown', this.keydownListener);
    this.unbindEvent('keypress', this.keypressListener);

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