import angular from 'angular';
import angularMeteor from 'angular-meteor';

import template from './snippetList.html';
import { Snippets } from '../../../api/snippets';

class SnippetList {
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

const name = 'snippetList';

// create a module
export default angular.module(name, [
  angularMeteor
])
.component(name, {
  template,
  controllerAs: name,
  controller: SnippetList
})
.config(config);

function config($stateProvider) {
  'ngInject';

  $stateProvider
    .state('snippetList', {
      url: '/snippetList',
      template: '<snippet-list></snippet-list>',
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