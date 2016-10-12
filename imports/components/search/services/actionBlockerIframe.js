class ActionBlockerIframeService {
  constructor($window) {
    'ngInject';

    this.$window = $window;
    this.iframeId = 'pageContainer';
    this.isTracking = false;
  }

  bindEvent(elem, evt, data, fn) {
    elem.on(evt, data, fn);
    console.log('bindIframe');
  }

  unbindEvent(elem, evt, fn) {
    elem.off(evt, fn);
    console.log('unbindIframe');
  }

  blockRightClick(evt) {
    console.log('Right Click Blocked!');
    evt.preventDefault();
  }

  service() {
    console.log('bindname', this.isTracking, this.iframeId);
    if (!this.isTracking) {
      var iframe = document.getElementById(this.iframeId);
      var innerDoc = iframe.contentDocument || iframe.contentWindow.document;
      var data = {};

      this.bindEvent(angular.element(innerDoc), 'contextmenu', data, this.blockRightClick);
      this.isTracking = true;
      console.log('bindIframe1');
    }
  }

  antiService() {
    if (this.isTracking) {
      var iframe = document.getElementById(this.iframeId);
      var innerDoc = iframe.contentDocument || iframe.contentWindow.document;

      this.unbindEvent(angular.element(innerDoc), 'contextmenu', this.blockRightClick);
      this.isTracking = false;
      console.log('unbindIframe1');
    }
  }
}

const name = 'actionBlockerIframe';

export default angular.module(name, [])
.service('ActionBlockerIframeService', ActionBlockerIframeService);


  