import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';

import template from './searchResults.html';
//import { Documents } from '../../../api/documents/index';

import { name as DocumentDetails } from '../documents/documentDetails';

class SearchResults {
  constructor($scope, $reactive, $state, $stateParams) {
    'ngInject';

    this.$state = $state;

    $reactive(this).attach($scope);

    this.subscribe('documents');

    this.documents = [];

    this.getResults($stateParams.query);
  }
  
  getResults(queryText) {
    var qt = queryText ? queryText : '';

    check(qt, String);

    this.call('searchDocuments', qt, function(error, result) {
      if (!error) {
        this.documents = result;
        //console.log('result', this.documents);
      }
      else {
        console.log(error);
      }
    });
  }

  doSearch() {
    var queryText = this.searchText ? this.searchText.toString() : '';
    this.$state.go('searchResults', {query: queryText});
  }
};

const name = 'searchResults';

// create a module
export default angular.module(name, [
  angularMeteor,
  uiRouter,
  DocumentDetails
])
.component(name, {
  template,
  controllerAs: name,
  controller: SearchResults
})
.config(config);

function config($stateProvider) {
  'ngInject';

  $stateProvider
    .state('searchResults', {
      url: '/searchResults/:query',
      template: '<search-results></search-results>',
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