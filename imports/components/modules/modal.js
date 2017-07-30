import { name as Question } from '../forms/modules/question';

import template from './modal.html';

/*
    dgacitua

    Module Dependencies:
        ui.bootstrap ($uibModal)
        Forms
*/

class ModalCtrl {
  constructor($uibModalInstance, customTitle, customTemplate, customFields, buttonType, buttonName, functions) {
    'ngInject';

    this.$uibModalInstance = $uibModalInstance;

    this.title = customTitle;
    this.template = customTemplate;
    this.fields = customFields;
    this.buttonType = buttonType;
    this.buttonName = buttonName;
    this.functions = functions;

    this.showFooter = (this.buttonType === 'okcancel' || this.buttonType === 'nextstage' || this.buttonType === 'next' || this.buttonType === 'back' || this.buttonType === 'button' || this.buttonType === 'save');
    this.answers = this.fields.content || {};
    
    this.response = {};
  }

  ok() {
    this.response.message = 'ok';

    // dgacitua: Parse questions and answers from NEURONE Forms Module
    if (this.fields.questions && this.form.$valid) {
      this.response.answers = this.parseAnswers(this.fields.questions);
      this.$uibModalInstance.close(this.response);
    }
    // dgacitua: Parse questions and answers from a standard form
    else if (this.form.$valid) {
      this.response.answers = this.answers;
      this.response.files = this.files;
      this.$uibModalInstance.close(this.response);
    }
    else {
      this.$uibModalInstance.close(this.response);
    }
  }

  cancel() {
    this.response.message = 'cancel';
    this.$uibModalInstance.dismiss(this.response.message);
  }

  button(msg) {
    this.response.message = msg;
    this.$uibModalInstance.close(this.response);
  }

  close() {
    this.response.message = 'close';
    this.$uibModalInstance.dismiss(this.response.message);
  }

  parseAnswers(questions) {
    let answerArray = [];

    questions.forEach((question) => {
      let response = {
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
  }
}

class ModalService {
  constructor($uibModal) {
    'ngInject';

    this.modal = {};
    this.$uibModal = $uibModal;
  }

  openModal(modalObject, callback) {
    let contentTitle = modalObject.title || '';
    let contentTemplate = modalObject.templateAsset || '';
    let contentFields = modalObject.fields || {};
    let buttonType = modalObject.buttonType || '';
    let buttonName = modalObject.buttonName || '';
    let modalSize = modalObject.size || 'lg';
    let functions = modalObject.functions || null;

    this.modal = this.$uibModal.open({
      template: template.default,
      animation: true,
      size: modalSize,
      controller: ModalCtrl,
      controllerAs: 'modal',
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
        },
        functions: () => {
          return functions;
        }
      }
    });

    this.modal.result.then((closeResponse) => {
      callback(null, closeResponse);
    },
    (dismissResponse) => {
      callback(null, { message: 'dismiss' });
    });
  }
}

export default angular.module(name, [
  Question
])
//.controller('ModalCtrl', ModalCtrl)
.service('ModalService', ModalService)
.component('modal', {
  template: template.default,
  controller: ModalCtrl,
  controllerAs: 'modal',
  bindings: {
    resolve: '<',
    close: '&',
    dismiss: '&'
  }
});