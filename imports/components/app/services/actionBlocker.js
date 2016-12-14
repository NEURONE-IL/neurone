class ActionBlockerService {
  constructor($window) {
    'ngInject';

    this.$window = $window;
    this.isTracking = false;
  }

  bindEvent(evt, data, fn) {
    angular.element(this.$window).on(evt, data, fn);
  }

  unbindEvent(evt, fn) {
    angular.element(this.$window).off(evt, fn);
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
      var data = {};
      
      this.bindEvent('contextmenu', data, this.blockRightClick);
      this.bindEvent('cut', data, this.blockCut);
      this.bindEvent('copy', data, this.blockCopy);
      this.bindEvent('paste', data, this.blockPaste);

      this.isTracking = true;
    }
  }

  antiService() {
    if (this.isTracking) {
      this.unbindEvent('contextmenu', this.blockRightClick);
      this.unbindEvent('cut', this.blockCut);
      this.unbindEvent('copy', this.blockCopy);
      this.unbindEvent('paste', this.blockPaste);

      this.isTracking = false;
    }
  }
}

const name = 'actionBlocker';

export default angular.module(name, [])
.service('ActionBlockerService', ActionBlockerService);
