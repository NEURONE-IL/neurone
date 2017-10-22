import { name as Question } from '../forms/modules/question';

import template from './modal.html';

/*
    dgacitua

    Module Dependencies:
        ui.bootstrap ($uibModal)
        Forms
*/

class ModalCtrl {
  constructor($uibModalInstance, $timeout, title, template, fields, buttonType, buttonName, functions) {
    'ngInject';

    this.$uibModalInstance = $uibModalInstance;
    this.$timeout = $timeout;

    this.title = title;
    this.template = template;
    this.fields = fields;
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
    if (this.fields.questions) {
      if (this.form.$valid) {
        this.response.answers = this.parseAnswers(this.fields.questions);
        this.$uibModalInstance.close(this.response);  
      }
    }
    // dgacitua: Parse questions and answers from a standard form
    else if (this.answers) {
      if (this.form.$valid) {
        this.response.answers = this.answers;
        this.$uibModalInstance.close(this.response);  
      }
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

  addElement(elementArray, elementContent) {
    this.$timeout(() => {
      console.log(elementArray, elementContent);
      elementArray = elementArray || [];
      elementArray.splice(elementArray.length, 0, elementContent);
      console.log(elementArray);
    }, 0);
  }

  removeElement(elementArray, elementIndex) {
    this.$timeout(() => {
      console.log(elementArray, elementIndex);
      elementArray = elementArray || [];
      elementArray.splice(elementIndex, 1);
      console.log(elementArray);
    }, 0);
  }
}

class ModalService {
  constructor($uibModal, $templateCache) {
    'ngInject';

    this.modal = {};
    this.$uibModal = $uibModal;
    this.$templateCache = $templateCache;
  }

  openModal(modalObject, callback) {
    let customTpl = this.resolveTemplate(modalObject),
            title = modalObject.title || '',
           fields = modalObject.fields || {},
       buttonType = modalObject.buttonType || '',
       buttonName = modalObject.buttonName || '',
        modalSize = modalObject.size || 'lg',
        modalBack = modalObject.backdrop || 'static',
        functions = modalObject.functions || null;

    this.modal = this.$uibModal.open({
      template: template.default,
      controller: ModalCtrl,
      controllerAs: 'modal',
      size: modalSize,
      backdrop: modalBack,
      animation: true,
      resolve: {
        title: () => {
          return title;
        },
        template: () => {
          return customTpl;
        },
        fields: () => {
          return fields;
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

  resolveTemplate(modalObject) {
    if (!!modalObject.templateString) {
      // TODO test template strings for modals
      this.$templateCache.put('myModalTemplate', modalObject.templateString);
      return "'myModalTemplate'";
    }
    else if (!!modalObject.templateAsset) {
      return modalObject.templateAsset;
    }
    else {
      return '';
    }
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