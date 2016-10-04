import angular from 'angular';
import angularMeteor from 'angular-meteor';

import template from './relevantPagesList.html';

import { RelevantPages } from '../../../api/relevantPages/index';

class RelevantPagesList {
  constructor($scope, $reactive) {
    'ngInject';
    
    $reactive(this).attach($scope);

    this.subscribe('relevantPages');

    this.helpers({
      links() {
        return RelevantPages.find({});
      }
    });
  }
};

const name = 'relevantPagesList';

// create a module
export default angular.module(name, [
  angularMeteor
])
.component(name, {
  template,
  controllerAs: name,
  controller: RelevantPagesList
})
.config(config);

function config($stateProvider) {
  'ngInject';

  $stateProvider
    .state('relevantPages', {
      url: '/relevantPages',
      template: '<relevant-pages-list></relevant-pages-list>',
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