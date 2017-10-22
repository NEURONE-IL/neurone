import Utils from '../../globalUtils';
import Configs from '../../globalConfigs';

import template from './documentManager.html';

import { Documents } from '../../../database/documents/index';
import { FlowComponents } from '../../../database/flowComponents/index';

class DocumentManager {
  constructor($scope, $reactive, ModalService) {
    'ngInject';

    this.modal = ModalService;

    $reactive(this).attach($scope);

    this.subscribe('documents');

    this.helpers({
      docs: () => Documents.find(),
      locales: () => FlowComponents.find({ type: 'locale' }),
      domains: () => FlowComponents.find({ type: 'domain' }),
      tasks: () => FlowComponents.find({ type: 'task' })
    });

    console.log('DocumentManager loaded!');
  }

  editDocument(doc) {
    let docRef = angular.copy(doc);
    docRef.keywords.join(', ');

    let modalOpts = {
      title: 'Edit document',
      templateAsset: 'adminAssets/adminDocumentModal.html',
      buttonType: 'save',
      fields: {
        content: docRef,
        locales: this.locales,
        domains: this.domains,
        tasks: this.tasks
      }
    }

    this.modal.openModal(modalOpts, (err, res) => {
      if (!err && res.answers) {
        let editedDocument = res.answers;

        //editedDocument.locale = !!(editedDocument.locale) ? editedDocument.locale[0].properties.code : '';
        //editedDocument.test = !!(editedDocument.test) ? editedDocument.test.map((obj) => { return obj.properties.alias }) : [];
        //editedDocument.topic = !!(editedDocument.topic) ? editedDocument.topic.map((obj) => { return obj.properties.alias }) : [];
        editedDocument.keywords = !!(editedDocument.keywords) && (editedDocument.keywords.length > 1) ? editedDocument.keywords.split(',').map((kw) => { return kw.trim() }) : [];
        delete editedDocument._id;

        Documents.update(doc._id, { $set: editedDocument }, (err, res) => {
          if (!err) {
            console.log('Document edited in Database!', res);

            this.call('reindex', (err, res) => {
              if (!err) console.log('Inverted Index regenerated!');
              else console.error('Cannot regenerate Inverted Index!', err);
            });
          }
          else {
            console.error('Error while editing Document!', err);
          }
        });
      }
    });
  }

  deleteDocument(doc) {
    let deletedDoc = angular.copy(doc);
    
    Documents.remove(deletedDoc._id, (err, res) => {
      if (!err) {
        console.log('Document deleted from Database!', deletedDoc.docId);

        this.call('reindex', (err, res) => {
          if (!err) console.log('Inverted Index regenerated!');
          else console.error('Cannot regenerate Inverted Index!', err);
        });
      }
      else {
        console.error('Cannot delete document!', deletedDoc.docId, err);
      }
    });

    /*
    this.call('deleteDocument', docId, (err, res) => {
      if (!err) console.log('Document deleted!', docId);
      else console.error('Cannot delete document!', docId, err);
    });
    */
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