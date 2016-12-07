import { name as Question } from '../forms/modules/question';

import template from './modal.html';

/*
    dgacitua

    Module Dependencies:
        ui.bootstrap ($uibModal)
        Forms
*/

class ModalCtrl {
  constructor($uibModalInstance, customTitle, customTemplate, customFields, buttonType, buttonName) {
    'ngInject';

    var $ctrl = this;

    $ctrl.title = customTitle;
    $ctrl.template = customTemplate;
    $ctrl.fields = customFields;
    $ctrl.buttonType = buttonType;
    $ctrl.buttonName = buttonName;

    $ctrl.showFooter = ($ctrl.buttonType === 'okcancel' || $ctrl.buttonType === 'nextstage' || $ctrl.buttonType === 'next' || $ctrl.buttonType === 'back' || $ctrl.buttonType === 'button') ? true : false;

    $ctrl.response = {};

    $ctrl.ok = function() {
      $ctrl.response.message = 'ok';
      if ($ctrl.fields.questions) $ctrl.response.answers = $ctrl.parseAnswers($ctrl.fields.questions);

      $uibModalInstance.close($ctrl.response);
    };

    $ctrl.cancel = function() {
      $ctrl.response.message = 'cancel';
      $uibModalInstance.dismiss($ctrl.response);
    };

    $ctrl.button = function(msg) {
      $ctrl.response.message = msg;
      $uibModalInstance.close($ctrl.response);
    };

    $ctrl.close = function() {
      $ctrl.response.message = 'close';
      $uibModalInstance.dismiss($ctrl.response);
    };

    $ctrl.parseAnswers = function(questions) {
      var answerArray = [];

      questions.forEach((question) => {
        var response = {
          type: question.type,
          questionId: question.questionId,
          title: question.title,
          answer: question.answer || ''
        };

        if (question.otherAnswer) {
          response.otherAnswer = question.otherAnswer;
        }

        answerArray.push(response);
      });

      return answerArray;
    };
  }
}

class ModalService {
  constructor($uibModal) {
    'ngInject';

    this.modal = {};
    this.$uibModal = $uibModal;
  }

  openModal(modalObject, callback) {
    var contentTitle = modalObject.title ? modalObject.title : '';
    var contentTemplate = modalObject.templateAsset ? modalObject.templateAsset : '';
    var contentFields = modalObject.fields ? modalObject.fields : {};
    var buttonType = modalObject.buttonType ? modalObject.buttonType : '';
    var buttonName = modalObject.buttonName ? modalObject.buttonName : '';

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
        },
        buttonType: () => {
          return buttonType;
        },
        buttonName: () => {
          return buttonName;
        }
      }
    });

    this.modal.result.then((closeResponse) => {
      callback(null, closeResponse);
    },
    () => {
      callback(null, { message: 'dismiss' });
    });
  }
}

export default angular.module(name, [
  Question
])
.controller('ModalCtrl', ModalCtrl)
.service('ModalService', ModalService);