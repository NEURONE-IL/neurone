import angular from 'angular';
import angularMeteor from 'angular-meteor';

import template from './documentRemove.html';

import { Documents } from '../../../database/documents/index';

class DocumentRemove {
  remove() {
    if (this.doc) {
      Documents.remove(this.doc._id);
    }
  }
};

const name = 'documentRemove';

// create a module
export default angular.module(name, [
  angularMeteor
]).component(name, {
  template,
  bindings: {
    doc: '<'
  },
  controllerAs: name,
  controller: DocumentRemove
});