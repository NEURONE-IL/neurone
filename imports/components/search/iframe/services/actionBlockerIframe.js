import LoggerConfigs from '../../../logger/loggerConfigs';

class ActionBlockerIframeService {
  constructor($window) {
    'ngInject';

    this.$window = $window;
    this.iframeId = LoggerConfigs.iframeId;
    this.isTracking = false;
  }

  bindEvent(elem, evt, data, fn) {
    elem.on(evt, data, fn);
  }

  unbindEvent(elem, evt, fn) {
    elem.off(evt, fn);
  }

  blockRightClick(evt) {
    console.log('Right Click Blocked!');
    evt.preventDefault();
  }

  blockCut(evt) {
    console.log('Cut Blocked!');
    evt.preventDefault();
  }

  blockCopy(evt) {
    console.log('Copy Blocked!');
    evt.preventDefault();
  }

  blockPaste(evt) {
    console.log('Paste Blocked!');
    evt.preventDefault();
  }

  service() {
    if (!this.isTracking) {
      var iframe = document.getElementById(this.iframeId) || document.getElementsByTagName('iframe')[0];
      var innerDoc = iframe.contentDocument || iframe.contentWindow.document;
      var data = {};

      this.bindEvent(angular.element(innerDoc), 'contextmenu', data, this.blockRightClick);
      //this.bindEvent(angular.element(innerDoc), 'cut', data, this.blockCut);
      //this.bindEvent(angular.element(innerDoc), 'copy', data, this.blockCopy);
      //this.bindEvent(angular.element(innerDoc), 'paste', data, this.blockPaste);
      this.isTracking = true;
    }
  }

  antiService() {
    if (this.isTracking) {
      var iframe = document.getElementById(this.iframeId) || document.getElementsByTagName('iframe')[0];
      var innerDoc = iframe.contentDocument || iframe.contentWindow.document;

      this.unbindEvent(angular.element(innerDoc), 'contextmenu', this.blockRightClick);
      //this.unbindEvent(angular.element(innerDoc), 'cut', this.blockCut);
      //this.unbindEvent(angular.element(innerDoc), 'copy', this.blockCopy);
      //this.unbindEvent(angular.element(innerDoc), 'paste', this.blockPaste);
      this.isTracking = false;
    }
  }
}

const name = 'actionBlockerIframe';

export default angular.module(name, [])
.service('ActionBlockerIframeService', ActionBlockerIframeService);


  