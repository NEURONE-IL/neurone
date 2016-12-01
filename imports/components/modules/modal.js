import template from './modal.html';

class ModalCtrl {
  constructor($uibModalInstance, customTitle, customTemplate, customFields) {
    'ngInject';

    var $ctrl = this;

    $ctrl.title = customTitle;
    $ctrl.template = customTemplate;
    $ctrl.fields = customFields;

    $ctrl.selected = {
      item: {}
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

  openModal(modalObject) {
    var contentTitle = modalObject.title ? modalObject.title : '';
    var contentTemplate = modalObject.templateAsset ? modalObject.templateAsset : '';
    var contentFields = modalObject.fields ? modalObject.fields : {};

    this.modal = this.$uibModal.open({
      template,
      animation: true,
      size: 'lg',
      controller: ModalCtrl,
      controllerAs: '$ctrl',
      resolve: {
        customTitle: () => {
          return contentTitle;
        },
        customTemplate: () => {
          return contentTemplate;
        },
        customFields: () => {
          return contentFields;
        }
      }
    });
  }
}

export default angular.module(name, [])
.controller('ModalCtrl', ModalCtrl)
.service('ModalService', ModalService);