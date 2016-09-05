import angular from 'angular';
import angularMeteor from 'angular-meteor';

import { name as App } from '../imports/ui/components/app/app';

import '../imports/lib/kmtrack';

angular.module('prototype2', [
  angularMeteor,
  App
]);

Meteor.startup(function() {
  if (Meteor.user()) {
    KMTrack.start();  
  }
});