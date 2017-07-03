import Utils from '../../globalUtils';
import Configs from '../../globalConfigs';

import template from './documentViewer.html';

class DocumentViewer {
  constructor($scope, $reactive) {
    'ngInject';

    $reactive(this).attach($scope);

    this.docs = {};

    this.listAllDocuments();

    console.log('DocumentViewer loaded!');
  }

  listAllDocuments() {
    this.call('listAllDocuments', this.docObj, (err, res) => {
      if (!err) {
        this.docs = res;
        console.log(this.docs);
      }
    });
  }

  deleteDocument(docId) {
    this.call('deleteDocument', docId, (err, res) => {
      if (!err) {
        this.listAllDocuments();
        console.log('Document deleted!', docId);
      }
      else {
        console.error('Cannot delete document!', docId);
      }
    });
  }
}

const name = 'documentViewer';

export default angular.module(name, [
])
.component(name, {
  template,
  controllerAs: name,
  controller: DocumentViewer
});