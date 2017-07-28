import Utils from '../../globalUtils';
import Configs from '../../globalConfigs';

import template from './contentCreator.html';

import { FlowComponents } from '../../../database/flowComponents/index';

class ContentCreator {
  constructor($scope, $reactive, ModalService) {
    'ngInject';

    this.modal = ModalService;

    $reactive(this).attach($scope);

    this.panel = {
      locale: false,
      domain: false,
      task: false,
      stage: false,
      asset: false
    };

    this.subscribe('flowcomponents');

    this.helpers({
      locales: () => FlowComponents.find({ type: 'locale' }),
      domains: () => FlowComponents.find({ type: 'domain' }),
      tasks: () => FlowComponents.find({ type: 'task' }),
      stages: () => FlowComponents.find({ type: 'stage'})
    });

    console.log('ContentCreator loaded!');
  }

  addModal(type) {
    let modalOpts = {};

    if (type === 'locale') {
      modalOpts = {
        title: 'Add new locale',
        templateAsset: 'adminAssets/adminLocaleModal.html',
        buttonType: 'save'
      };
    }
    else if (type === 'domain') {
      modalOpts = {
        title: 'Add new domain',
        templateAsset: 'adminAssets/adminDomainModal.html',
        buttonType: 'save'
      };
    }
    else if (type === 'task') {
      modalOpts = {
        title: 'Add new task',
        templateAsset: 'adminAssets/adminTaskModal.html',
        buttonType: 'save'
      };
    }
    else if (type === 'stage') {
      modalOpts = {
        title: 'Add new stage',
        templateAsset: 'adminAssets/adminStageModal.html',
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
        templateAsset: 'adminAssets/adminLocaleModal.html',
        buttonType: 'save',
        fields: {
          content: elementRef
        }
      };
    }
    else if (type === 'domain') {
      modalOpts = {
        title: 'Edit domain',
        templateAsset: 'adminAssets/adminDomainModal.html',
        buttonType: 'save',
        fields: {
          content: elementRef
        }
      };
    }
    else if (type === 'task') {
      modalOpts = {
        title: 'Edit task',
        templateAsset: 'adminAssets/adminTaskModal.html',
        buttonType: 'save',
        fields: {
          content: elementRef
        }
      };
    }
    else if (type === 'stage') {
      modalOpts = {
        title: 'Edit stage',
        templateAsset: 'adminAssets/adminStageModal.html',
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

  uploadFile() {
    let modalOpts = {
      title: 'Upload Asset',
      templateAsset: 'admin/adminUploadModal.html',
      buttonType: 'save',
      size: 'md'
    };

    this.modal.openModal(modalOpts, (err, res) => {
      if (!err) {
        console.log(res);
      }
    });
  }

  loadContent() {

  }

  loadAssets() {

  }
}

const name = 'contentCreator';

export default angular.module(name, [
])
.component(name, {
  template: template.default,
  controllerAs: name,
  controller: ContentCreator
});