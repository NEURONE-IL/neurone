import angular from 'angular';
import angularMeteor from 'angular-meteor';

import { name as Search } from '../imports/ui/components/search/search';

angular.module('prototype2', [
  angularMeteor,
  Search
])
  
  /*
  .controller('SearchCtrl', function($scope) {
    'ngInject';

    $reactive(this).attach($scope);

    $scope.message = "Hello World!";

    this.helpers({
      documents() {
        return Documents.find({});
      }
    });
  })
  */

  /*
  .component('search', {
    templateUrl: 'client/search/search.html',
    controllerAs: 'search',
    controller($scope, $reactive) {
      'ngInject';
      $reactive(this).attach($scope);

      $scope.message = "Hello World!";

      this.helpers({
        documents() {
          return Documents.find({});
        }
      });
    }
  })*/
;




/*
import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './main.html';

Template.hello.onCreated(function helloOnCreated() {
  // counter starts at 0
  this.counter = new ReactiveVar(0);
});

Template.hello.helpers({
  counter() {
    return Template.instance().counter.get();
  },
});

Template.hello.events({
  'click button'(event, instance) {
    // increment the counter when button is clicked
    instance.counter.set(instance.counter.get() + 1);
  },
});
*/