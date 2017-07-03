import { Meteor } from 'meteor/meteor';

import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';

import template from './documentDetails.html';

import { Documents } from '../../../database/documents/index';

class DocumentDetails {
  constructor($scope, $reactive, $stateParams) {
    'ngInject';

    $reactive(this).attach($scope);

    this.subscribe('documentDetails');

    this.paramId = $stateParams.docId.toString();
    this.loadDocument(this.paramId);
  }

  loadDocument(docId) {
    this.doc = Documents.findOne({ 'id': docId });
    console.log('Loading document!', docId, this.doc);
  }
};

const name = 'documentDetails';

// create a module
export default angular.module(name, [
  angularMeteor,
  uiRouter
])
.component(name, {
  template: template.default,
  controllerAs: name,
  controller: DocumentDetails
})
.config(config);

function config($stateProvider) {
  'ngInject';

  $stateProvider.state('documentDetails', {
    url: '/documents/:docId',
    template: '<document-details></document-details>',
    resolve: {
      currentUser($q) {
        if (Meteor.userId() === null) {
          return $q.reject('AUTH_REQUIRED');
        }
        else {
          return $q.resolve();
        }
      }
    }
  });
};