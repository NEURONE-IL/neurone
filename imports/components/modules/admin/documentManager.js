import Utils from '../../globalUtils';
import Configs from '../../globalConfigs';

import template from './documentManager.html';

import { Documents } from '../../../database/documents/index';

class DocumentManager {
  constructor($scope, $reactive) {
    'ngInject';

    $reactive(this).attach($scope);

    this.subscribe('documents');

    this.helpers({
      docs: () => Documents.find()
    });

    console.log('DocumentManager loaded!');
  }

  editDocument(doc) {
    alert('hi!');
  }

  deleteDocument(doc) {
    /*
    this.call('deleteDocument', docId, (err, res) => {
      if (!err) console.log('Document deleted!', docId);
      else console.error('Cannot delete document!', docId, err);
    });
    */
    Documents.remove(doc._id, (err, res) => {
      if (!err) console.log('Document deleted!', docId);
      else console.error('Cannot delete document!', docId, err);
    });
  }
}

const name = 'documentManager';

export default angular.module(name, [
])
.component(name, {
  template: template.default,
  controllerAs: name,
  controller: DocumentManager
});