import Utils from '../../globalUtils';
import Configs from '../../globalConfigs';

import template from './documentManager.html';

import { Documents } from '../../../database/documents/index';
import { FlowComponents } from '../../../database/flowComponents/index';
import { ImageSearch, Video, Book } from '../../../database/multimediaObjects';

class DocumentManager {
  constructor($scope, $reactive, ModalService, LoadingService) {
    'ngInject';

    this.modal = ModalService;
    this.loading = LoadingService;

    $reactive(this).attach($scope);

    this.subscribe('documents');
    this.subscribe('Video');
    this.subscribe('Book');
    this.subscribe('ImageSearch');
   

    this.helpers({
      docs: () => Documents.find(),
      videos: () => Video.find(),
      books: () => Book.find(),
      img: () => ImageSearch.find(),
      locales: () => FlowComponents.find({ type: 'locale' }),
      domains: () => FlowComponents.find({ type: 'domain' }),
      tasks: () => FlowComponents.find({ type: 'task' })
    });

    console.log('DocumentManager loaded!');
  }

  editDocument(doc) {
    let docRef = angular.copy(doc);
    if (docRef.type != 'video')
      docRef.keywords = docRef.keywords.join(', ');
    
    let titleEdited;

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
        if(doc.type == 'book'){
          Book.update(doc._id, { $set: editedDocument }, (err, res) => {
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
        else if (doc.type == 'video') {
          Video.update(doc._id, { $set: editedDocument }, (err, res) => {
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
        else{
          if (editedDocument.title != doc.title ){
             titleEdited = true;
          }

          Documents.update(doc._id, { $set: editedDocument }, (err, res) => {
            if (!err) {
              console.log('Document edited in Database!', res);
              console.log( editedDocument._id)
              if (titleEdited){
                ImageSearch.find({route: doc._id}).fetch().forEach(element => {
                  element.title = editedDocument.title;
                  ImageSearch.update(element._id, { $set: element }, (errImg, resImg) => {
                    if (!err) {
                      console.log('Document edited in Database!', element._id);
                      }
                      else
                      console.log(errImg)
                    })
                  })
                }

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
      }
    });
  }

  deleteDocument(doc) {
    let deletedDoc = angular.copy(doc);
    if(doc.type == 'video'){

      Video.remove(deletedDoc._id, (err, res) => {
        if (!err) {
          console.log('Document deleted from Database!', deletedDoc.docId);
          this.call('deleteFile', deletedDoc, (err, res) => {
            if (!err) console.log('File deleted!');
            else console.error('Error deleting file!', err);
          });
          this.call('reindex', (err, res) => {
            if (!err) console.log('Inverted Index regenerated!');
            else console.error('Cannot regenerate Inverted Index!', err);
          });
        }
        else {
          console.error('Cannot delete document!', deletedDoc.docId, err);
        }
      });
    }
    else if(doc.type == 'book'){
      Book.remove(deletedDoc._id, (err, res) => {
        if (!err) {
          console.log('Document deleted from Database!', deletedDoc.docId);
          this.call('deleteFile', deletedDoc, (err, res) => {
            if (!err) console.log('File deleted!');
            else console.error('Error deleting file!', err);
          });
          this.call('reindex', (err, res) => {
            if (!err) console.log('Inverted Index regenerated!');
            else console.error('Cannot regenerate Inverted Index!', err);
          });
        }
        else {
          console.error('Cannot delete document!', deletedDoc.docId, err);
        }
      });
    }
    else
    Documents.remove(deletedDoc._id, (err, res) => {
      if (!err) {
        console.log('Document deleted from Database!', deletedDoc.docId);

        ImageSearch.find({route: deletedDoc._id}).fetch().forEach(element => {
          ImageSearch.remove(element._id, (err, res) => {
            if (!err) {
              console.log('Document deleted from Database!', element._id);
              }
        else {
          console.error('Cannot delete document!', element._id, err);
        }});
        }); 
          
      
        this.call('reindex', (err, res) => {
          if (!err) console.log('Inverted Index regenerated!');
          else console.error('Cannot regenerate Inverted Index!', err);
        });
      }
      else {
        console.error('Cannot delete document!', deletedDoc.docId, err);
      }
    });
  }

  reindex() {
    let params = { message: `Reloading Inverted Index...` };
    this.loading.start(params);

    this.call('reindex', (err, res) => {
      if (!err) {
        this.loading.stop();
        console.log('Inverted Index reloaded!');
        alert('Inverted Index reloaded!');
      }
      else {
        this.loading.stop();
        console.error('Cannot reload Inverted Index!', err);
        alert('Cannot reload Inverted Index!');
      }
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