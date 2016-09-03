import angular from 'angular';
import angularMeteor from 'angular-meteor';

import template from './search.html';
import { Documents } from '../../../api/documents';

class Search {
  constructor($scope, $reactive) {
    'ngInject';

    $reactive(this).attach($scope);

    this.searchText = '';

    this.helpers({

    });
  }

  doSearch() {
    var query = this.searchText.toString();

    Meteor.call('searchDocIndex', query, function (error, result) {
      if (error) {
        console.log('ERROR! ' + error);
        return [];
      }
      else {
        console.log('Query: ' + query);
        console.log(result);
        return result;
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

