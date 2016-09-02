import angular from 'angular';
import angularMeteor from 'angular-meteor';

import template from './search.html';
import { Documents } from '../../../api/documents';

class Search {
  constructor($scope, $reactive) {
    'ngInject';

    $reactive(this).attach($scope);

    $scope.message = "Hello World!";

    this.helpers({
      documents() {
        return Documents.find({});
      }
    });
  }
};

const name = 'search';

// create a module
export default angular.module(name, [
  angularMeteor
])
.component(name, {
  template,
  controllerAs: name,
  controller: Search
})
.config(config);

function config($stateProvider) {
  'ngInject';

  $stateProvider
    .state('search', {
      url: '/search',
      template: '<search></search>',
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

