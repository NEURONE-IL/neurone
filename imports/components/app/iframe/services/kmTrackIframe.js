import '../../../../utils/limit'

import Utils from '../../../globalUtils';
import LogUtils from '../../../logUtils';
import LoggerConfigs from '../../../globalConfigs';

export default class KMTrackIframeService {
constructor($window, $document, $state) {
    'ngInject';

    this.$window = $window;
    this.$document = $document;
    this.$state = $state;

    this.isTracking = false;
    this.iframeId = LoggerConfigs.iframeId;
    this.iframeSelected = false;
  }

  bindEventIframe(elem, evt, data, fn) {
    elem.on(evt, data, fn);
    LogUtils.logToConsole('BIND!', 'Iframe', elem, evt);
  }

  bindThrottledEventIframe(elem, evt, data, fn, delay) {
    elem.on(evt, data, fn.throttle(delay));
    LogUtils.logToConsole('BIND THROTTLED!', 'Iframe', elem, evt, delay);
  }

  unbindEventIframe(elem, evt, fn) {
    elem.off(evt, fn);
    LogUtils.logToConsole('UNBIND!', 'Iframe', elem, evt);
  }

  mouseMoveListener(evt) {
    if (!!Meteor.userId() && LoggerConfigs.mouseCoordsLogging) {
      // From http://stackoverflow.com/a/11744120/1319998
      var w = evt.data.w,
          d = evt.data.d,
          e = evt.data.e,
          g = evt.data.g,
         pw = angular.element(parent.window),
        ifm = angular.element(parent.document.getElementById(evt.data.iframeId)),
        // ol = ifm.position().left,
        // ot = ifm.position().top,
          w = window.innerWidth  || e.clientWidth  || g.clientWidth,
          h = window.innerHeight || e.clientHeight || g.clientHeight,
          s = evt.data.s,
        src = s.href(s.current.name, s.params, {absolute: false}),
       time = Utils.getTimestamp();

      var docX = evt.pageX,
          docY = evt.pageY,
          winX = evt.clientX,
          winY = evt.clientY,
          docW = ifm.contents().width(),
          docH = ifm.contents().height(),
          winW = w,
          winH = h;

      //console.log(winX, winY, winW, winH, docX, docY, docW, docH);

      var movementOutput = {
        userId: Meteor.userId(),
        username: Meteor.user().username || Meteor.user().emails[0].address,
        type: 'MouseMovement',
        source: 'Iframe',
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
    if (!!Meteor.userId() && LoggerConfigs.mouseCoordsLogging) {
      // From http://stackoverflow.com/a/11744120/1319998
      var w = evt.data.w,
          d = evt.data.d,
          e = evt.data.e,
          g = evt.data.g,
         pw = angular.element(parent.window),
        ifm = angular.element(parent.document.getElementById(evt.data.iframeId)),
        // ol = ifm.position().left,
        // ot = ifm.position().top,
          w = window.innerWidth  || e.clientWidth  || g.clientWidth,
          h = window.innerHeight || e.clientHeight || g.clientHeight,
          s = evt.data.s,
        src = s.href(s.current.name, s.params, {absolute: false}),
       time = Utils.getTimestamp();

      var docX = evt.pageX,
          docY = evt.pageY,
          winX = evt.clientX,
          winY = evt.clientY,
          docW = ifm.contents().width(),
          docH = ifm.contents().height(),
          winW = w,
          winH = h;

      var clickOutput = {
        userId: Meteor.userId(),
        username: Meteor.user().username || Meteor.user().emails[0].address,
        type: 'MouseClick',
        source: 'Iframe',
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
      var w = evt.data.w,
          d = evt.data.d,
          e = evt.data.e,
          g = evt.data.g,
         pw = angular.element(parent.window),
        ifm = angular.element(parent.document.getElementById(evt.data.iframeId)),
        // ol = ifm.position().left,
        // ot = ifm.position().top,
          w = window.innerWidth  || e.clientWidth  || g.clientWidth,
          h = window.innerHeight || e.clientHeight || g.clientHeight,
          s = evt.data.s,
        src = s.href(s.current.name, s.params, {absolute: false}),
       time = Utils.getTimestamp();
      
      var scrollX = ifm.contents().scrollLeft(),
          scrollY = ifm.contents().scrollTop(),
          docW = ifm.contents().width(),
          docH = ifm.contents().height(),
          winW = w,
          winH = h;

      var scrollOutput = {
        userId: Meteor.userId(),
        username: Meteor.user().username || Meteor.user().emails[0].address,
        type: 'Scroll',
        source: 'Iframe',
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
      
    var t = Utils.getTimestamp(),
       kc = evt.keyCode,
        w = evt.which,
      chc = evt.charCode,
      chr = String.fromCharCode(kc || chc),
        s = evt.data.s,
      src = s.href(s.current.name, s.params, {absolute: false});

    if (!!Meteor.userId() && LoggerConfigs.keyboardLogging) {
      var keyOutput = {
        userId: Meteor.userId(),
        username: Meteor.user().username || Meteor.user().emails[0].address,
        type: 'KeyDown',
        source: 'Iframe',
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
      
    var t = Utils.getTimestamp(),
       kc = evt.keyCode,
        w = evt.which,
      chc = evt.charCode,
      chr = String.fromCharCode(kc || chc),
        s = evt.data.s,
      src = s.href(s.current.name, s.params, {absolute: false});

    if (!!Meteor.userId() && LoggerConfigs.keyboardLogging) {
      var keyOutput = {
        userId: Meteor.userId(),
        username: Meteor.user().username || Meteor.user().emails[0].address,
        type: 'KeyPress',
        source: 'Iframe',
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
    var pageContainer = Utils.getAngularElementById(this.iframeId);
    
    if (pageContainer) {
      var iframe = document.getElementById(this.iframeId) || document.getElementsByTagName('iframe')[0];
      var innerDoc = iframe.contentWindow || iframe.contentDocument;    //iframe.contentDocument || iframe.contentWindow.document;
      var targetDoc = angular.element(innerDoc);

      var data = {
        iframeId: this.iframeId,
        s: this.$state,
        w: angular.element(window),
        d: angular.element(document),
        e: angular.element(document)[0].documentElement,
        g: angular.element(document)[0].getElementsByTagName('body')[0]
      };

      //LogUtils.logToConsole('Start Tracking Iframe!', targetDoc);

      this.bindThrottledEventIframe(targetDoc, 'mousemove', data, this.mouseMoveListener, LoggerConfigs.eventThrottle);
      this.bindThrottledEventIframe(targetDoc, 'scroll', data, this.scrollListener, LoggerConfigs.eventThrottle);
      this.bindEventIframe(targetDoc, 'click', data, this.mouseClickListener);
      this.bindEventIframe(targetDoc, 'keydown', data, this.keydownListener);
      this.bindEventIframe(targetDoc, 'keypress', data, this.keypressListener);
    }

    this.isTracking = true;
  }

  stopTrack() {
    var pageContainer = Utils.getAngularElementById(this.iframeId);
    
    if (pageContainer) {
      var iframe = document.getElementById(this.iframeId) || document.getElementsByTagName('iframe')[0];
      var innerDoc = iframe.contentWindow || iframe.contentDocument;    //iframe.contentDocument || iframe.contentWindow.document;
      var targetDoc = angular.element(innerDoc);

      //LogUtils.logToConsole('Stop Tracking Iframe!');

      this.unbindEventIframe(targetDoc, 'mousemove', this.mouseMoveListener);
      this.unbindEventIframe(targetDoc, 'scroll', this.mouseMoveListener);
      this.unbindEventIframe(targetDoc, 'click', this.mouseClickListener);
      this.unbindEventIframe(targetDoc, 'keydown', this.keydownListener);
      this.unbindEventIframe(targetDoc, 'keypress', this.keypressListener);
    }

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

const name = 'kmTrackLogger';

export default angular.module(name, [])
.service('KMTrackIframeService', KMTrackIframeService);