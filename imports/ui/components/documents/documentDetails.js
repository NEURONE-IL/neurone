import { Meteor } from 'meteor/meteor';

import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';

import template from './documentDetails.html';

import { Documents } from '../../../api/documents';

class DocumentDetails {
  constructor($stateParams) {
    'ngInject';

    this.doc = Documents.findOne($stateParams.docId);
  }
};

const name = 'documentDetails';

// create a module
export default angular.module(name, [
  angularMeteor,
  uiRouter
])
.component(name, {
  template,
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