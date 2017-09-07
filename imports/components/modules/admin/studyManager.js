import Utils from '../../globalUtils';
import Configs from '../../globalConfigs';

import template from './studyManager.html';

import { FlowComponents } from '../../../database/flowComponents/index';
import { Locales } from '../../../database/assets/locales';
import { Modals } from '../../../database/assets/modals';
import { Templates } from '../../../database/assets/templates';
import { Images } from '../../../database/assets/images';
import { FormQuestions } from '../../../database/formQuestions/index';
import { FormQuestionnaires } from '../../../database/formQuestionnaires/index';
import { SynthesisQuestions } from '../../../database/synthesisQuestions/index';

class StudyManager {
  constructor($scope, $reactive, ModalService) {
    'ngInject';

    this.modal = ModalService;

    $reactive(this).attach($scope);

    this.subscribe('flowcomponents');
    this.subscribe('locales');
    this.subscribe('modals');
    this.subscribe('templates');
    this.subscribe('images');
    this.subscribe('formQuestions');
    this.subscribe('formQuestionnaires');
    this.subscribe('synthesisQuestions');

    this.helpers({
      locales: () => FlowComponents.find({ type: 'locale' }),
      domains: () => FlowComponents.find({ type: 'domain' }),
      tasks: () => FlowComponents.find({ type: 'task' }),
      stages: () => FlowComponents.find({ type: 'stage'}),
      localeAssets: () => Locales.find().cursor,
      modalAssets: () => Modals.find().cursor,
      templateAssets: () => Templates.find().cursor,
      imageAssets: () => Images.find().cursor,
      questions: () => FormQuestions.find(),
      questionnaires: () => FormQuestionnaires.find(),
      synthesis: () => SynthesisQuestions.find()
    });

    console.log('StudyManager loaded!');
  }

  add(type) {
    let targetCollection = {},
               modalOpts = {};

    if (type === 'stage') {
      modalOpts = {
        title: 'Add new stage',
        templateAsset: 'adminAssets/adminStageModal.html',
        buttonType: 'save',
        fields: {
          stages: this.availableStages,
          modals: this.modalAssets,
          templates: this.templateAssets,
          images: this.imageAssets
        }
      };

      targetCollection = FlowComponents;
    }
    else if (type === 'flow') {
      modalOpts = {
        title: 'Add new study flow',
        templateAsset: 'adminAssets/adminFlowModal.html',
        buttonType: 'save',
        fields: {
          locales: this.locales,
          domains: this.domains,
          tasks: this.tasks,
          stages: this.availableStages,
          modals: this.modalAssets,
          templates: this.templateAssets,
          images: this.imageAssets
        }
      };

      targetCollection = FlowComponents;
    }
    else {
      console.error('Invalid content option!');
      return false;
    }

    this.modal.openModal(modalOpts, (err, res) => {
      if (!err && res.answers) {
        let newStudyComponent = res.answers;
        newStudyComponent.type = type;

        targetCollection.insert(newQuestion, (err, res) => {
          if (!err) console.log('Study Component created!', type, res);
          else console.error('Error while creating Study Component!', err);
        });
      }
    });
  }

  edit(type, content) {

  }

  remove(type, content) {

  }
}

const name = 'studyManager';

export default angular.module(name, [
])
.component(name, {
  template: template.default,
  controllerAs: name,
  controller: StudyManager
});