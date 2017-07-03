import angular from 'angular';
import angularMeteor from 'angular-meteor';

import template from './bookmarksList.html';

import { Bookmarks } from '../../../database/bookmarks/index';

class BookmarksList {
  constructor($scope, $reactive) {
    'ngInject';
    
    $reactive(this).attach($scope);

    this.subscribe('bookmarks');

    this.helpers({
      links() {
        return Bookmarks.find({});
      }
    });
  }
};

const name = 'bookmarksList';

// create a module
export default angular.module(name, [
  angularMeteor
])
.component(name, {
  template: template.default,
  controllerAs: name,
  controller: BookmarksList
})
.config(config);

function config($stateProvider) {
  'ngInject';

  $stateProvider
    .state('bookmarks', {
      url: '/bookmarks',
      template: '<bookmarks-list></bookmarks-list>',
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