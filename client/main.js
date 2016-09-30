import angular from 'angular';
import angularMeteor from 'angular-meteor';

import { name as App } from '../imports/components/app/app';

angular.module('prototype2', [
  angularMeteor,
  App
]);

Meteor.startup(function() {});