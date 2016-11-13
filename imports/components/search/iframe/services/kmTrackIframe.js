import '../../../../lib/limit'

import Utils from '../../../logger/loggerUtils';
import LoggerConfigs from '../../../logger/loggerConfigs';

export default class KMTrackIframeService {
  constructor($state) {
    'ngInject';

    this.$state = $state;

    this.isTracking = false;
    this.iframeId = LoggerConfigs.iframeId;
    this.iframeSelected = false;
  }

  bindEventIframe(elem, evt, data, fn) {
    elem.on(evt, data, fn);
    Utils.logToConsole('IFRAME BIND!', elem, evt);
  }

  bindThrottledEventIframe(elem, evt, data, fn, delay) {
    elem.on(evt, data, fn.throttle(delay));
    Utils.logToConsole('IFRAME BIND THROTTLED!', elem, evt, delay);
  }

  unbindEventIframe(elem, evt, fn) {
    elem.off(evt, fn);
    Utils.logToConsole('IFRAME UNBIND!', elem, evt);
  }

  mouseMoveListener(evt) {
    // From http://stackoverflow.com/a/11744120/1319998
    var w = evt.data.w,
        d = evt.data.d,
        e = evt.data.e,
        g = evt.data.g,
       pw = angular.element(parent.window),
      ifm = angular.element(parent.document.getElementById(evt.data.iframeId)),
       ol = ifm.position().left,
       ot = ifm.position().top,
        w = window.innerWidth  || e.clientWidth  || g.clientWidth,
        h = window.innerHeight || e.clientHeight || g.clientHeight,
        s = evt.data.s,
      src = s.href(s.current.name, s.params, {absolute: false}),
     time = Utils.getTimestamp();

    var docX = evt.pageX + ol,
        docY = evt.pageY + ot,
        winX = evt.clientX + ol,
        winY = evt.clientY + ot,
        docW = ifm.contents().width() + ol,
        docH = ifm.contents().height() + ot,
        winW = w,
        winH = h;

    //console.log(winX, winY, winW, winH, docX, docY, docW, docH);

    if (!!Meteor.userId() && LoggerConfigs.mouseCoordsLogging) {
      Utils.logToConsole('Mouse Movement!', 'X:' + winX + ' Y:' + winY + ' W:' + winW + ' H:' + winH + ' docX:' + docX + ' docY:' + docY + ' docW:' + docW + ' docH:' + docH + ' TIME:' + time + ' SRC:' + src);

      var movement_output = {
        type: 'mouse_movement',
        owner: Meteor.userId(),
        username: Meteor.user().emails[0].address,
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

      Meteor.call('storeMouseCoordinate', movement_output, function(err, result) {});
    }
  }

  mouseClickListener(evt) {
    // From http://stackoverflow.com/a/11744120/1319998
    var w = evt.data.w,
        d = evt.data.d,
        e = evt.data.e,
        g = evt.data.g,
       pw = angular.element(parent.window),
      ifm = angular.element(parent.document.getElementById(evt.data.iframeId)),
       ol = ifm.position().left,
       ot = ifm.position().top,
        w = window.innerWidth  || e.clientWidth  || g.clientWidth,
        h = window.innerHeight || e.clientHeight || g.clientHeight,
        s = evt.data.s,
      src = s.href(s.current.name, s.params, {absolute: false}),
     time = Utils.getTimestamp();

    var docX = evt.pageX + ol,
        docY = evt.pageY + ot,
        winX = evt.clientX + ol,
        winY = evt.clientY + ot,
        docW = ifm.contents().width() + ol,
        docH = ifm.contents().height() + ot,
        winW = w,
        winH = h;

    if (!!Meteor.userId() && LoggerConfigs.mouseClicksLogging) {
      Utils.logToConsole('Mouse Click!', 'X:' + winX + ' Y:' + winY + ' W:' + winW + ' H:' + winH + ' docX:' + docX + ' docY:' + docY + ' docW:' + docW + ' docH:' + docH + ' TIME:' + time + ' SRC:' + src);

      var click_output = {
        type: 'mouse_click',
        owner: Meteor.userId(),
        username: Meteor.user().emails[0].address,
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

      Meteor.call('storeMouseClick', click_output, function(err, result) {});
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
         ol = ifm.position().left,
         ot = ifm.position().top,
          w = window.innerWidth  || e.clientWidth  || g.clientWidth,
          h = window.innerHeight || e.clientHeight || g.clientHeight,
          s = evt.data.s,
        src = s.href(s.current.name, s.params, {absolute: false}),
       time = Utils.getTimestamp();
      
      var scrollX = ifm.contents().scrollLeft(),
          scrollY = ifm.contents().scrollTop(),
          docW = ifm.contents().width() + ol,
          docH = ifm.contents().height() + ot,
          winW = w,
          winH = h;

      var movement_output = {
        type: 'scroll',
        owner: Meteor.userId(),
        username: Meteor.user().emails[0].address,
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
        s = evt.data.s,
      src = s.href(s.current.name, s.params, {absolute: false});

    if (!!Meteor.userId() && LoggerConfigs.keyboardLogging) {
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

      var key_output = {
        type: 'key_down',
        keyCode: kc,
        which: w,
        charCode: chc,
        chr: chr,
        localTimestamp: t,
        url: src,
        owner: Meteor.userId(),
        username: Meteor.user().emails[0].address
      };

      Meteor.call('storeKeystroke', key_output, function(err, result) {});
    }
  }

  keycharListener(evt) {
    evt = evt || event;
      
    var t = Utils.getTimestamp(),
       kc = evt.keyCode,
        w = evt.which,
      chc = evt.charCode,
      chr = String.fromCharCode(kc || chc),
        s = evt.data.s,
      src = s.href(s.current.name, s.params, {absolute: false});

    if (!!Meteor.userId() && LoggerConfigs.keyboardLogging) {
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

      var key_output = {
        type: 'key_press',
        keyCode: kc,
        which: w,
        charCode: chc,
        chr: chr,
        localTimestamp: t,
        url: src,
        owner: Meteor.userId(),
        username: Meteor.user().emails[0].address
      };

      Meteor.call('storeKeystroke', key_output, function(err, result) {});
    }
  }

  onPageContainerListener() {
    // From http://stackoverflow.com/q/9314666
    this.iframeSelected = true;
    //console.log('IFRAME Selected!', this.iframeSelected);
  }

  offPageContainerListener() {
    // From http://stackoverflow.com/q/9314666
    this.iframeSelected = false;
    //console.log('IFRAME Not Selected!', this.iframeSelected);
  }

  startTrack() {
    var pageContainer = Utils.getAngularElementById(this.iframeId);
    
    if (pageContainer) {
      //this.bindEventIframe(pageContainer, 'mouseover', this.onPageContainerListener);
      //this.bindEventIframe(pageContainer, 'mouseout', this.offPageContainerListener);

      var iframe = document.getElementById(this.iframeId) || document.getElementsByTagName('iframe')[0];
      var innerDoc = iframe.contentDocument || iframe.contentWindow.document;

      var data = {
        iframeId: this.iframeId,
        s: this.$state,
        w: angular.element(window),
        d: angular.element(document),
        e: angular.element(document)[0].documentElement,
        g: angular.element(document)[0].getElementsByTagName('body')[0]
      };
      Utils.logToConsole('Start Tracking!', this.iframeId, iframe, innerDoc, data);

      this.bindThrottledEventIframe(angular.element(innerDoc), 'mousemove', data, this.mouseMoveListener, LoggerConfigs.eventThrottle);
      this.bindThrottledEventIframe(angular.element(innerDoc), 'scroll', data, this.scrollListener, LoggerConfigs.eventThrottle);
      this.bindEventIframe(angular.element(innerDoc), 'click', data, this.mouseClickListener);
      this.bindEventIframe(angular.element(innerDoc), 'keydown', data, this.keystrokeListener);
      this.bindEventIframe(angular.element(innerDoc), 'keypress', data, this.keycharListener);
    }

    this.isTracking = true;
  }

  stopTrack() {
    var pageContainer = Utils.getAngularElementById(this.iframeId);
    
    if (pageContainer) {
      //this.unbindEventIframe(pageContainer, 'mouseover', this.onPageContainerListener);
      //this.unbindEventIframe(pageContainer, 'mouseout', this.offPageContainerListener);

      var iframe = document.getElementById(this.iframeId) || document.getElementsByTagName('iframe')[0];
      var innerDoc = iframe.contentDocument || iframe.contentWindow.document;
      Utils.logToConsole('Stop Tracking!', this.iframeId, iframe, innerDoc);

      this.unbindEventIframe(angular.element(innerDoc), 'mousemove', this.mouseMoveListener);
      this.unbindEventIframe(angular.element(innerDoc), 'scroll', this.mouseMoveListener);
      this.unbindEventIframe(angular.element(innerDoc), 'click', this.mouseClickListener);
      this.unbindEventIframe(angular.element(innerDoc), 'keydown', this.keystrokeListener);
      this.unbindEventIframe(angular.element(innerDoc), 'keypress', this.keycharListener);
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