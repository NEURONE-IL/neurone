import { Meteor } from 'meteor/meteor';

import Utils from '../../../lib/utils';
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
  }


  bindEvent(evt, fn) {
    angular.element(this.$window).on(evt, fn);
    console.log('BIND!', evt);
  }

  unbindEvent(evt, fn) {
    angular.element(this.$window).off(evt, fn);
    console.log('UNBIND!', evt);
  }

  mouseMoveListener(evt) {
    // From http://stackoverflow.com/a/23323821
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

    if (x == null && evt.clientX != null) {
      x = evt.clientX + (e && e.scrollLeft || g && g.scrollLeft || 0)
      - (e && e.clientLeft || g && g.clientLeft || 0);
    }

    if (y == null && evt.clientY != null) {
      y = evt.clientY + (e && e.scrollTop  || g && g.scrollTop  || 0)
      - (e && e.clientTop  || g && g.clientTop  || 0);
    }

    var docX = x,
        docY = y,
        winX = docX - d.scrollLeft(),
        winY = docY - d.scrollTop(),
        docW = d.width(),
        docH = d.height(),
        winW = w,
        winH = h;

    //console.log(winX, winY, winW, winH, docX, docY, docW, docH);

    if (Meteor.user() && LoggerConfigs.mouseCoordsLogging) {
      Utils.logToConsole('Mouse Movement! X:' + winX + ' Y:' + winY + ' W:' + winW + ' H:' + winH + ' docX:' + docX + ' docY:' + docY + ' docW:' + docW + ' docH:' + docH + ' TIME:' + time + ' SRC:' + src);

      var movement_output = {
        type: 'mouse_movement',
        x_pos: winX,
        y_pos: winY,
        w_scr: winW,
        h_scr: winH,
        x_doc: docX,
        y_doc: docY,
        w_doc: docW,
        h_doc: docH,
        local_time: time,
        src_url: src,
        owner: Meteor.userId(),
        username: Meteor.user().emails[0].address
      };

      //Meteor.call('storeMouseCoordinate', movement_output, function(err, result) {});
    }
  }

  mouseClickListener(evt) {
    // From http://stackoverflow.com/a/11744120/1319998
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

    if (x == null && evt.clientX != null) {
      x = evt.clientX + (e && e.scrollLeft || g && g.scrollLeft || 0)
      - (e && e.clientLeft || g && g.clientLeft || 0);
    }

    if (y == null && evt.clientY != null) {
      y = evt.clientY + (e && e.scrollTop  || g && g.scrollTop  || 0)
      - (e && e.clientTop  || g && g.clientTop  || 0);
    }

    var docX = x,
        docY = y,
        winX = docX - d.scrollLeft(),
        winY = docY - d.scrollTop(),
        docW = d.width(),
        docH = d.height(),
        winW = w,
        winH = h;

    //console.log(winX, winY, winW, winH, docX, docY, docW, docH);

    if (Meteor.user() && LoggerConfigs.mouseClicksLogging) {
      Utils.logToConsole('Mouse Click! X:' + winX + ' Y:' + winY + ' W:' + winW + ' H:' + winH + ' docX:' + docX + ' docY:' + docY + ' docW:' + docW + ' docH:' + docH + ' TIME:' + time + ' SRC:' + src);

      var click_output = {
        type: 'mouse_click',
        x_pos: winX,
        y_pos: winY,
        w_scr: winW,
        h_scr: winH,
        x_doc: docX,
        y_doc: docY,
        w_doc: docW,
        h_doc: docH,
        local_time: time,
        src_url: src,
        owner: Meteor.userId(),
        username: Meteor.user().emails[0].address
      };

      //Meteor.call('storeMouseClick', click_output, function(err, result) {});
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

    if (Meteor.user() && LoggerConfigs.keyboardLogging) {
      Utils.logToConsole('Key Pressed!   ' + 
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

      //Meteor.call('storeKeystroke', key_output, function(err, result) {});
    }
  }

  startTrack() {
    this.bindEvent('mousemove', this.mouseMoveListener);
    this.bindEvent('click', this.mouseClickListener);
    this.bindEvent('keydown', this.keystrokeListener);

    this.isTracking = true;
  }

  stopTrack() {
    this.unbindEvent('mousemove', this.mouseMoveListener);
    this.unbindEvent('click', this.mouseClickListener);
    this.unbindEvent('keydown', this.keystrokeListener);

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