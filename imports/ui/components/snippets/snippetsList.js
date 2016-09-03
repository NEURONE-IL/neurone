import angular from 'angular';
import angularMeteor from 'angular-meteor';

//import Utils from '../../lib/utils.js';

import template from './snippetsList.html';

import { Snippets } from '../../../api/snippets';

class SnippetsList {
  constructor($scope, $reactive) {
    'ngInject';
    
    $reactive(this).attach($scope);

    this.helpers({
      snippets() {
        return Snippets.find({});
      }
    });
  }
};

const name = 'snippetsList';

// create a module
export default angular.module(name, [
  angularMeteor
])
.component(name, {
  template,
  controllerAs: name,
  controller: SnippetsList
})
.config(config);

function config($stateProvider) {
  'ngInject';

  $stateProvider
    .state('snippets', {
      url: '/snippets',
      template: '<snippets-list></snippets-list>',
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