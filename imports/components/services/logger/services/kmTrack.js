import '../../../../utils/limit';

import Utils from '../../../globalUtils';
import LogUtils from '../../../logUtils';
import LoggerConfigs from '../../../globalConfigs';

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
    this.isAdmin = false;

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

  bindEvent(elem, evt, data, fn) {
    elem.on(evt, data, fn);
    LogUtils.logToConsole('BIND!', 'Window', elem, evt);
  }

  bindThrottledEvent(elem, evt, data, fn, delay) {
    elem.on(evt, data, fn.throttle(delay));
    LogUtils.logToConsole('BIND THROTTLED!', 'Window', elem, evt, delay);
  }

  unbindEvent(elem, evt, fn) {
    elem.off(evt, fn);
    LogUtils.logToConsole('UNBIND!', 'Window', elem, evt);
  }

  mouseMoveListener(evt) {
    if (!!Meteor.userId() && LoggerConfigs.mouseCoordsLogging) {
      // From http://stackoverflow.com/a/23323821
      let win = evt.data.w,
          doc = evt.data.d,
          elm = evt.data.e,
          gtb = evt.data.g,
          w = window.innerWidth  || elm.clientWidth  || gtb.clientWidth,
          h = window.innerHeight || elm.clientHeight || gtb.clientHeight,
          s = evt.data.s,
        src = s.href(s.current.name, s.params, {absolute: false}),
       time = Utils.getTimestamp();
            
      let docX = evt.pageX,
          docY = evt.pageY,
          winX = evt.clientX,
          winY = evt.clientY,
          docW = doc.width(),
          docH = doc.height(),
          winW = w,
          winH = h;

      let movementOutput = {
        userId: Meteor.userId(),
        username: Meteor.user().username || Meteor.user().emails[0].address || '',
        type: 'MouseMovement',
        source: 'Window',
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

      LogUtils.logToConsole('Mouse Movement!', movementOutput.source, 'X:' + winX + ' Y:' + winY + ' W:' + winW + ' H:' + winH + ' docX:' + docX + ' docY:' + docY + ' docW:' + docW + ' docH:' + docH + ' TIME:' + time + ' SRC:' + src);
      Meteor.apply('storeMouseCoordinate', [ movementOutput ], { noRetry: true }, (err, result) => {});
    }
  }

  mouseClickListener(evt) {
    if (!!Meteor.userId() && LoggerConfigs.mouseClicksLogging) {
      // From http://stackoverflow.com/a/11744120/1319998
      let win = evt.data.w,
          doc = evt.data.d,
          elm = evt.data.e,
          gtb = evt.data.g,
            w = window.innerWidth  || elm.clientWidth  || gtb.clientWidth,
            h = window.innerHeight || elm.clientHeight || gtb.clientHeight,
            s = evt.data.s,
          src = s.href(s.current.name, s.params, {absolute: false}),
         time = Utils.getTimestamp();

      let docX = evt.pageX,
          docY = evt.pageY,
          winX = evt.clientX,
          winY = evt.clientY,
          docW = doc.width(),
          docH = doc.height(),
          winW = w,
          winH = h;
      
      let clickOutput = {
        userId: Meteor.userId(),
        username: Meteor.user().username || Meteor.user().emails[0].address || '',
        type: 'MouseClick',
        source: 'Window',
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

      LogUtils.logToConsole('Mouse Click!', clickOutput.source, 'X:' + winX + ' Y:' + winY + ' W:' + winW + ' H:' + winH + ' docX:' + docX + ' docY:' + docY + ' docW:' + docW + ' docH:' + docH + ' TIME:' + time + ' SRC:' + src);
      Meteor.apply('storeMouseClick', [ clickOutput ], { noRetry: true }, (err, result) => {});
    }
  }

  scrollListener(evt) {
    if (!!Meteor.userId() && LoggerConfigs.mouseCoordsLogging) {
      // From http://stackoverflow.com/a/23323821
      let win = evt.data.w,
          doc = evt.data.d,
          elm = evt.data.e,
          gtb = evt.data.g,
            w = window.innerWidth  || elm.clientWidth  || gtb.clientWidth,
            h = window.innerHeight || elm.clientHeight || gtb.clientHeight,
            s = evt.data.s,
          src = s.href(s.current.name, s.params, {absolute: false}),
         time = Utils.getTimestamp();
      
      let scrollX = window.scrollX,
          scrollY = window.scrollY,
          docW = doc.width(),
          docH = doc.height(),
          winW = w,
          winH = h;

      let scrollOutput = {
        userId: Meteor.userId(),
        username: Meteor.user().username || Meteor.user().emails[0].address || '',
        type: 'Scroll',
        source: 'Window',
        url: src,
        x_scr: scrollX,
        y_scr: scrollY,
        w_win: winW,
        h_win: winH,
        w_doc: docW,
        h_doc: docH,
        localTimestamp: time
      };

      LogUtils.logToConsole('Scroll Movement!', scrollOutput.source, 'scrX:' + scrollX + ' scrY:' + scrollY + ' W:' + winW + ' H:' + winH + ' docW:' + docW + ' docH:' + docH + ' TIME:' + time + ' SRC:' + src);
      Meteor.apply('storeScrollMove', [ scrollOutput ], { noRetry: true }, (err, result) => {});
    }
  }

  keydownListener(evt) {
    evt = evt || event;
      
    let t = Utils.getTimestamp(),
       kc = evt.keyCode,
        w = evt.which,
      chc = evt.charCode,
      chr = String.fromCharCode(kc || chc),
        s = evt.data.s,
      src = s.href(s.current.name, s.params, {absolute: false});
    
    if (!!Meteor.userId() && LoggerConfigs.keyboardLogging) {
      let keyOutput = {
        userId: Meteor.userId(),
        username: Meteor.user().username || Meteor.user().emails[0].address || '',
        type: 'KeyDown',
        source: 'Window',
        keyCode: kc,
        which: w,
        charCode: chc,
        chr: chr,
        localTimestamp: t,
        url: src
      };

      LogUtils.logToConsole('Key Pressed!', keyOutput.source,
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

      Meteor.apply('storeKeystroke', [ keyOutput ], { noRetry: true }, (err, result) => {});
    }
  }

  keypressListener(evt) {
    evt = evt || event;
      
    let t = Utils.getTimestamp(),
       kc = evt.keyCode,
        w = evt.which,
      chc = evt.charCode,
      chr = String.fromCharCode(kc || chc),
        s = evt.data.s,
      src = s.href(s.current.name, s.params, {absolute: false});
    
    if (!!Meteor.userId() && LoggerConfigs.keyboardLogging) {
      let keyOutput = {
        userId: Meteor.userId(),
        username: Meteor.user().username || Meteor.user().emails[0].address || '',
        type: 'KeyPress',
        source: 'Window',
        keyCode: kc,
        which: w,
        charCode: chc,
        chr: chr,
        localTimestamp: t,
        url: src
      };

      LogUtils.logToConsole('Key Pressed!', keyOutput.source,
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

      Meteor.apply('storeKeystroke', [ keyOutput ], { noRetry: true }, (err, result) => {});
    }
  }

  startTrack() {
    let targetDoc = angular.element(this.$window);

    let data = {
      w: angular.element(window),
      d: angular.element(document),
      e: angular.element(document)[0].documentElement,
      g: angular.element(document)[0].getElementsByTagName('body')[0],
      s: this.$state
    };

    this.bindThrottledEvent(targetDoc, 'mousemove', data, this.mouseMoveListener, LoggerConfigs.eventThrottle);
    this.bindThrottledEvent(targetDoc, 'scroll', data, this.scrollListener, LoggerConfigs.eventThrottle);
    this.bindEvent(targetDoc, 'click', data, this.mouseClickListener);
    this.bindEvent(targetDoc, 'keydown', data, this.keydownListener);
    this.bindEvent(targetDoc, 'keypress', data, this.keypressListener);

    this.isTracking = true;
  }

  stopTrack() {
    let targetDoc = angular.element(this.$window);
    
    this.unbindEvent(targetDoc, 'mousemove', this.mouseMoveListener);
    this.unbindEvent(targetDoc, 'scroll', this.scrollListener);
    this.unbindEvent(targetDoc, 'click', this.mouseClickListener);
    this.unbindEvent(targetDoc, 'keydown', this.keydownListener);
    this.unbindEvent(targetDoc, 'keypress', this.keypressListener);

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