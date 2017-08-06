import Utils from '../../globalUtils';
import Configs from '../../globalConfigs';

import template from './formBuilder.html';

import { FormQuestions } from '../../../database/formQuestions/index';
import { FormQuestionnaires } from '../../../database/formQuestionnaires/index';
import { SynthesisQuestions } from '../../../database/synthesisQuestions/index';

class FormBuilder {
  constructor($scope, $reactive, ModalService) {
    'ngInject';

    this.modal = ModalService;

    $reactive(this).attach($scope);

    this.panel = {
      question: false,
      questionnaire: false,
      synthesis: false
    };

    this.subscribe('formQuestions');
    this.subscribe('formQuestionnaires');
    this.subscribe('synthesisQuestions');

    this.helpers({
      questions: () => FormQuestions.find(),
      questionnaires: () => FormQuestionnaires.find(),
      synthesis: () => SynthesisQuestions.find()
    });

    console.log('ContentCreator loaded!');
  }

  addModal(type) {
    let targetCollection = {},
               modalOpts = {};

    if (type === 'question') {
      modalOpts = {
        title: 'Add new question',
        templateAsset: 'adminAssets/adminQuestionModal.html',
        buttonType: 'save',
        fields: {
          content: { type: 'paragraph' }
        }
      };

      targetCollection = FormQuestions;
    }
    else if (type === 'questionnaire') {
      modalOpts = {
        title: 'Add new questionnaire',
        templateAsset: 'adminAssets/adminQuestionnaireModal.html',
        buttonType: 'save'
      };

      targetCollection = FormQuestionnaires;
    }
    else if (type === 'synthesis') {
      modalOpts = {
        title: 'Add new synthesis',
        templateAsset: 'adminAssets/adminSynthesisModal.html',
        buttonType: 'save'
      };

      targetCollection = SynthesisQuestions;
    }
    else {
      console.error('Invalid content option!');
      return false;
    }

    if (!Utils.isEmptyObject(modalOpts) && !!type) {
      this.modal.openModal(modalOpts, (err, res) => {
        if (!err && res.answers) {
          let newQuestion = res.answers;
          
          targetCollection.insert(newQuestion, (err, res) => {
            if (!err) console.log('Question Element created!', type, res);
            else console.error('Error while creating Question Element!', err);
          });
        }
      });
    }
  }

  editModal(type, element) {
    let targetCollection = {},
               modalOpts = {},
              elementRef = angular.copy(element);
    
    if (type === 'question') {
      modalOpts = {
        title: 'Add new question',
        templateAsset: 'adminAssets/adminQuestionModal.html',
        buttonType: 'save',
        fields: {
          content: elementRef
        }
      };

      targetCollection = FormQuestions;
    }
    else if (type === 'questionnaire') {
      modalOpts = {
        title: 'Add new questionnaire',
        templateAsset: 'adminAssets/adminQuestionnaireModal.html',
        buttonType: 'save',
        fields: {
          content: elementRef
        }
      };

      targetCollection = FormQuestionnaires;
    }
    else if (type === 'synthesis') {
      modalOpts = {
        title: 'Add new synthesis',
        templateAsset: 'adminAssets/adminSynthesisModal.html',
        buttonType: 'save',
        fields: {
          content: elementRef
        }
      };

      targetCollection = SynthesisQuestions;
    }
    else {
      console.error('Invalid content option!');
      return false;
    }

    if (!Utils.isEmptyObject(modalOpts) && !!type && !!element) {
      this.modal.openModal(modalOpts, (err, res) => {
        if (!err && res.answers) {
          let editedQuestion = res.answers;
          delete editedQuestion._id;

          targetCollection.update(element._id, { $set: editedQuestion }, (err, res) => {
            if (!err) console.log('Question Element edited!', type, res);
            else console.error('Error while editing Question Element!', err);
          });
        }
      });
    }
  }

  removeModal(type, element) {
    let targetCollection = {};

    if (type === 'question') targetCollection = FormQuestions;
    else if (type === 'questionnaire') targetCollection = FormQuestionnaires;
    else if (type === 'synthesis') targetCollection = SynthesisQuestions;
    else return false;

    targetCollection.remove(element._id, (err, res) => {
      if (!err) console.log('Question Element removed!');
      else console.error('Error while removing Question Element!', err);
    });
  }
}

const name = 'formBuilder';

export default angular.module(name, [
])
.component(name, {
  template: template.default,
  controllerAs: name,
  controller: FormBuilder
});