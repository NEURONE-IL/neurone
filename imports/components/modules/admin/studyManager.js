import Utils from '../../globalUtils';
import Configs from '../../globalConfigs';

import template from './studyManager.html';

import { FlowComponents } from '../../../database/flowComponents/index';
import { FlowElements } from '../../../database/flowElements/index';
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

    this.subscribe('flowComponents');
    this.subscribe('flowElements');
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
      stages: () => FlowElements.find({ type: 'stage' }),
      flows: () => FlowElements.find({ type: 'flow' }),
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
    console.log('Create!', type);

    let targetCollection = FlowElements,
               modalOpts = {},
           componentType = '';

    if (type === 'taskQuestions') {
      modalOpts = {
        title: 'Add new task questions stage',
        templateAsset: 'adminAssets/adminStageModals/taskQuestions.html',
        buttonType: 'save',
        fields: {
          content: { state: type },
          questionnaires: this.questionnaires,
          images: this.imageAssets
        }
      };

      componentType = 'stage';
    }
    else if (type === 'affective') {
      modalOpts = {
        title: 'Add new affective stage',
        templateAsset: 'adminAssets/adminStageModals/affective.html',
        buttonType: 'save',
        fields: {
          content: { state: type },
          templates: this.templateAssets
        }
      };

      componentType = 'stage';
    }
    else if (type === 'instructions') {
      modalOpts = {
        title: 'Add new instructions stage',
        templateAsset: 'adminAssets/adminStageModals/instructions.html',
        buttonType: 'save',
        fields: {
          content: { state: type },
          templates: this.templateAssets
        }
      };

      componentType = 'stage';
    }
    else if (type === 'tutorial') {
      modalOpts = {
        title: 'Add new tutorial stage',
        templateAsset: 'adminAssets/adminStageModals/tutorial.html',
        buttonType: 'save',
        fields: {
          content: { state: type },
          images: this.imageAssets
        }
      };

      componentType = 'stage';
    }
    else if (type === 'search') {
      modalOpts = {
        title: 'Add new search stage',
        templateAsset: 'adminAssets/adminStageModals/search.html',
        buttonType: 'save',
        fields: {
          content: { state: type },
          modals: this.modalAssets,
          images: this.imageAssets
        }
      };

      componentType = 'stage';
    }
    else if (type === 'collection') {
      modalOpts = {
        title: 'Add new collection stage',
        templateAsset: 'adminAssets/adminStageModals/collection.html',
        buttonType: 'save',
        fields: {
          content: { state: type },
          modals: this.modalAssets,
          images: this.imageAssets
        }
      };

      componentType = 'stage';
    }
    else if (type === 'criticalEval') {
      modalOpts = {
        title: 'Add new critical evaluation stage',
        templateAsset: 'adminAssets/adminStageModals/criticalEval.html',
        buttonType: 'save',
        fields: {
          content: { state: type },
          modals: this.modalAssets,
          images: this.imageAssets,
          questionnaires: this.questionnaires
        }
      };

      componentType = 'stage';
    }
    else if (type === 'synthesis') {
      modalOpts = {
        title: 'Add new synthesis stage',
        templateAsset: 'adminAssets/adminStageModals/synthesis.html',
        buttonType: 'save',
        fields: {
          content: { state: type },
          modals: this.modalAssets,
          images: this.imageAssets,
          synthesis: this.synthesis
        }
      };

      componentType = 'stage';
    }
    else if (type === 'end') {
      modalOpts = {
        title: 'Add new end stage',
        templateAsset: 'adminAssets/adminStageModals/end.html',
        buttonType: 'save',
        fields: {
          content: { state: type }
        }
      };

      componentType = 'stage';
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
          stages: this.stages,
          modals: this.modalAssets,
          templates: this.templateAssets,
          images: this.imageAssets
        }
      };

      componentType = 'flow';
    }
    else {
      console.error('Invalid content option!');
      return false;
    }

    this.modal.openModal(modalOpts, (err, res) => {
      if (!err && res.answers) {
        let newStudyComponent = angular.copy(res.answers);
        newStudyComponent.type = componentType;

        //console.log(newStudyComponent);

        targetCollection.insert(newStudyComponent, (err, res) => {
          if (!err) console.log('Study Component created!', type, res);
          else console.error('Error while creating Study Component!', err);
        });
      }
    });
  }

  edit(type, content) {
    console.log('Edit!', type, content, content._id);

    let targetCollection = FlowElements,
               modalOpts = {},
           componentType = '',
              elementRef = angular.copy(content);

    if (type === 'taskQuestions') {
      modalOpts = {
        title: 'Add new task questions stage',
        templateAsset: 'adminAssets/adminStageModals/taskQuestions.html',
        buttonType: 'save',
        fields: {
          content: elementRef,
          questionnaires: this.questionnaires,
          images: this.imageAssets
        }
      };

      componentType = 'stage';
    }
    else if (type === 'affective') {
      modalOpts = {
        title: 'Add new affective stage',
        templateAsset: 'adminAssets/adminStageModals/affective.html',
        buttonType: 'save',
        fields: {
          content: elementRef,
          templates: this.templateAssets
        }
      };

      componentType = 'stage';
    }
    else if (type === 'instructions') {
      modalOpts = {
        title: 'Add new instructions stage',
        templateAsset: 'adminAssets/adminStageModals/instructions.html',
        buttonType: 'save',
        fields: {
          content: elementRef,
          templates: this.templateAssets
        }
      };

      componentType = 'stage';
    }
    else if (type === 'tutorial') {
      modalOpts = {
        title: 'Add new tutorial stage',
        templateAsset: 'adminAssets/adminStageModals/tutorial.html',
        buttonType: 'save',
        fields: {
          content: elementRef,
          images: this.imageAssets
        }
      };

      componentType = 'stage';
    }
    else if (type === 'search') {
      modalOpts = {
        title: 'Add new search stage',
        templateAsset: 'adminAssets/adminStageModals/search.html',
        buttonType: 'save',
        fields: {
          content: elementRef,
          modals: this.modalAssets,
          images: this.imageAssets
        }
      };

      componentType = 'stage';
    }
    else if (type === 'collection') {
      modalOpts = {
        title: 'Add new collection stage',
        templateAsset: 'adminAssets/adminStageModals/collection.html',
        buttonType: 'save',
        fields: {
          content: elementRef,
          modals: this.modalAssets,
          images: this.imageAssets
        }
      };

      componentType = 'stage';
    }
    else if (type === 'criticalEval') {
      modalOpts = {
        title: 'Add new critical evaluation stage',
        templateAsset: 'adminAssets/adminStageModals/criticalEval.html',
        buttonType: 'save',
        fields: {
          content: elementRef,
          modals: this.modalAssets,
          images: this.imageAssets,
          questionnaires: this.questionnaires
        }
      };

      componentType = 'stage';
    }
    else if (type === 'synthesis') {
      modalOpts = {
        title: 'Add new synthesis stage',
        templateAsset: 'adminAssets/adminStageModals/synthesis.html',
        buttonType: 'save',
        fields: {
          content: elementRef,
          modals: this.modalAssets,
          images: this.imageAssets
        }
      };

      componentType = 'stage';
    }
    else if (type === 'end') {
      modalOpts = {
        title: 'Add new end stage',
        templateAsset: 'adminAssets/adminStageModals/end.html',
        buttonType: 'save',
        fields: {
          content: elementRef
        }
      };

      componentType = 'stage';
    }
    else if (type === 'flow') {
      modalOpts = {
        title: 'Add new study flow',
        templateAsset: 'adminAssets/adminFlowModal.html',
        buttonType: 'save',
        fields: {
          content: elementRef,
          locales: this.locales,
          domains: this.domains,
          tasks: this.tasks,
          stages: this.stages,
          modals: this.modalAssets,
          templates: this.templateAssets,
          images: this.imageAssets
        }
      };

      componentType = 'flow';
    }
    else {
      console.error('Invalid content option!');
      return false;
    }

    this.modal.openModal(modalOpts, (err, res) => {
      if (!err && res.answers) {
        let editedStudyComponent = angular.copy(res.answers);
        delete editedStudyComponent._id;

        //console.log(editedStudyComponent);

        targetCollection.update(content._id, { $set: editedStudyComponent }, (err, res) => {
          if (!err) {
            console.log('Study Component edited!', res, content._id, editedStudyComponent);
            if (type == 'search'){
              targetCollection.find({stages: { $elemMatch : { _id:content._id }}}).fetch().forEach(element => {
                element.stages.forEach(stage => {
                  if (stage._id == content._id){
                    element.stages[element.stages.indexOf(stage)] = content
                    console.log(element)
                  }
                })
                targetCollection.update(element._id , {$set: element}, (error, response) => {
                  if (!err) {
                    console.log('Study Component updated!', response, element._id, element);
                  }
                  else console.error('Error while updating Study Component!', error);
                })
              })
            }
          }
          else console.error('Error while creating Study Component!', err);
        });
      }
    });
  }

  remove(type, content) {
    console.log('Remove!', type, content, content._id);

    FlowElements.remove(content._id, (err, res) => {
      if (!err) console.log('Study Component removed!');
      else console.error('Error while removing Question Element!', err);
    });
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