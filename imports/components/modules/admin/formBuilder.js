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
    let modalOpts = {};

    if (type === 'question') {
      modalOpts = {
        title: 'Add new locale',
        templateAsset: 'admin/adminLocaleModal.html',
        buttonType: 'save'
      };
    }
    else if (type === 'domain') {
      modalOpts = {
        title: 'Add new domain',
        templateAsset: 'admin/adminDomainModal.html',
        buttonType: 'save'
      };
    }
    else if (type === 'task') {
      modalOpts = {
        title: 'Add new task',
        templateAsset: 'admin/adminTaskModal.html',
        buttonType: 'save'
      };
    }
    else if (type === 'stage') {
      modalOpts = {
        title: 'Add new stage',
        templateAsset: 'admin/adminStageModal.html',
        buttonType: 'save'
      };
    }
    else {
      console.error('Invalid content option!');
    }

    if (!Utils.isEmptyObject(modalOpts) && !!type) {
      this.modal.openModal(modalOpts, (err, res) => {
        if (!err && res.answers) {
          let newFlowComponent = res.answers;
          newFlowComponent.type = type;

          FlowComponents.insert(newFlowComponent, (err, res) => {
            if (!err) console.log('Flow Component created!', type, res);
            else console.error('Error while creating Flow Component!', err);
          });
        }
      });
    }
  }

  editModal(type, element) {
    let modalOpts = {};
    let elementRef = angular.copy(element);

    if (type === 'locale') {
      modalOpts = {
        title: 'Edit locale',
        templateAsset: 'admin/adminLocaleModal.html',
        buttonType: 'save',
        fields: {
          content: elementRef
        }
      };
    }
    else if (type === 'domain') {
      modalOpts = {
        title: 'Edit domain',
        templateAsset: 'admin/adminDomainModal.html',
        buttonType: 'save',
        fields: {
          content: elementRef
        }
      };
    }
    else if (type === 'task') {
      modalOpts = {
        title: 'Edit task',
        templateAsset: 'admin/adminTaskModal.html',
        buttonType: 'save',
        fields: {
          content: elementRef
        }
      };
    }
    else if (type === 'stage') {
      modalOpts = {
        title: 'Edit stage',
        templateAsset: 'admin/adminStageModal.html',
        buttonType: 'save',
        fields: {
          content: elementRef
        }
      };
    }
    else {
      console.error('Invalid content option!');
    }

    if (!Utils.isEmptyObject(modalOpts) && !!type && !!element) {
      this.modal.openModal(modalOpts, (err, res) => {
        if (!err && res.answers) {
          let editedFlowComponent = res.answers;
          editedFlowComponent.type = type;
          delete editedFlowComponent._id;

          FlowComponents.update(element._id, { $set: editedFlowComponent }, (err, res) => {
            if (!err) console.log('Flow Component edited!', type, res);
            else console.error('Error while editing Flow Component!', err);
          });
        }
      });
    }
  }

  removeModal(element) {
    FlowComponents.remove(element._id, (err, res) => {
      if (!err) console.log('Flow Component removed!', type, res);
      else console.error('Error while removing Flow Component!', err);
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