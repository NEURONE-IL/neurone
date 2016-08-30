import angular from 'angular';
import angularMeteor from 'angular-meteor';

import template from './search.html';

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
]).component(name, {
  template,
  controllerAs: name,
  controller: Search
});

