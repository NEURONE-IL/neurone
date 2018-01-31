import angular from 'angular';
import angularMeteor from 'angular-meteor';

import Utils from '../globalUtils';

import template from './loading.html';

class LoadingCtrl {
  constructor($uibModalInstance, message) {
    this.message = message;
  }
}

class LoadingService {
  constructor($uibModal) {
    'ngInject';

    this.modal = {};
    this.$uibModal = $uibModal;
  }

  start(modalObject) {
    let params = {
      template: template.default,
      controller: () => {},
      controllerAs: 'modal',
      size: 'xs',
      backdrop: 'static',
      animation: true,
      resolve: {
        message: () => { return modalObject.message || 'Loading...'; },
      }
    };

    this.modal = this.$uibModal.open(params);

    this.modal.result.then(
      (closeResponse) => { this.modal = {} },
      (dismissResponse) => { this.modal = {} }
    );
  }

  stop() {
    if (!Utils.isEmptyObject(this.modal)) this.modal.close('');
  }
}

const name = 'LoadingServiceModule';

export default angular.module(name, [])
.service('LoadingService', LoadingService);