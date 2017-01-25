import angular from 'angular';
import angularMeteor from 'angular-meteor';

import template from './documentAdd.html';

import { Documents } from '../../../database/documents/index';

class DocumentAdd {
  constructor() {
    this.doc = {};
  }

  submit() {
    var date = new Date();
    this.doc.date = date.toJSON();
    this.doc.userId = Meteor.userId();
    Documents.insert(this.doc);
    this.reset();
  }

  reset() {
    this.doc = {};
  }
};

const name = 'documentAdd';
 
// create a module
export default angular.module(name, [
  angularMeteor
])
.component(name, {
  template,
  controllerAs: name,
  controller: DocumentAdd
});

