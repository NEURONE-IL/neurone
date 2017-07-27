import Utils from '../../globalUtils';
import Configs from '../../globalConfigs';

import template from './contentCreator.html';

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

    this.content = [
      { _id: 5, type: 'locale', name: 'es' },
      { _id: 9, type: 'locale', name: 'en' },
      { _id: 10, type: 'domain', name: 'science' },
      { _id: 11, type: 'domain', name: 'article' }
    ];

    console.log('ContentCreator loaded!');
  }

  addModal(type) {
    if (type === 'locale') {
      let modalOpts = {
        title: 'Add new locale',
        templateAsset: 'admin/newLocaleModal.html',
        buttonType: 'okcancel',
        submitFunction: (text) => {
          alert('hi! ' + text);
        }
      };

      this.modal.openModal(modalOpts, (err, res) => {});
    }
    else {

    }
  }

  uploadFile() {

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