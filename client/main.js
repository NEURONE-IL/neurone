import angular from 'angular';
import angularMeteor from 'angular-meteor';

import Locale from './lib/locale'

import { name as App } from '../imports/components/app/app';

angular.module('prototype2', [
  angularMeteor,
  App
]);

Meteor.startup(function() {});