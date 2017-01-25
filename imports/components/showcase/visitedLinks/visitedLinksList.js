import angular from 'angular';
import angularMeteor from 'angular-meteor';

import template from './visitedLinksList.html';

import { VisitedLinks } from '../../../database/visitedLinks/index';

class VisitedLinksList {
  constructor($scope, $reactive) {
    'ngInject';
    
    $reactive(this).attach($scope);

    this.subscribe('visitedlinks');

    this.helpers({
      links() {
        return VisitedLinks.find({});
      }
    });
  }
};

const name = 'visitedLinksList';

// create a module
export default angular.module(name, [
  angularMeteor
])
.component(name, {
  template,
  controllerAs: name,
  controller: VisitedLinksList
})
.config(config);

function config($stateProvider) {
  'ngInject';

  $stateProvider
    .state('visitedLinks', {
      url: '/visitedLinks',
      template: '<visited-links-list></visited-links-list>',
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