import template from './modal.html';

class ModalCtrl {
  constructor($uibModalInstance) {
    'ngInject';

    var $ctrl = this;

    $ctrl.items = [1, 2, 3];

    $ctrl.selected = {
      item: $ctrl.items[0]
    };

    $ctrl.ok = function () {
      $uibModalInstance.close($ctrl.selected.item);
    };

    $ctrl.cancel = function () {
      $uibModalInstance.dismiss('cancel');
    };

    $ctrl.close = function () {
      $uibModalInstance.close();
    };
  }
}

class ModalService {
  constructor($uibModal) {
    'ngInject';

    this.modal = {};
    this.$uibModal = $uibModal;
  }

  openModal() {
    console.log('Opening modal!');

    this.modal = this.$uibModal.open({
      template,
      animation: true,
      size: 'lg',
      windowClass: 'modal-xl',
      controller: ModalCtrl,
      controllerAs: '$ctrl',
      resolve: {
        item: () => {
          return '';
        }
      }
    });
  }
}

export default angular.module(name, [])
.controller('ModalCtrl', ModalCtrl)
.service('ModalService', ModalService);