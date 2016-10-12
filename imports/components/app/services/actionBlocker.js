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

  service() {
    if (!this.isTracking) {
      var data = {};
      this.bindEvent('contextmenu', data, this.blockRightClick);
      console.log('bindEvent!');
      this.isTracking = true;
    }
  }

  antiService() {
    if (this.isTracking) {
      this.unbindEvent('contextmenu', this.blockRightClick);
      console.log('unbindEvent!');
      this.isTracking = false;
    }
  }
}

const name = 'actionBlocker';

export default angular.module(name, [])
.service('ActionBlockerService', ActionBlockerService);


  