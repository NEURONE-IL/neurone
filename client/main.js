import angular from 'angular';
import angularMeteor from 'angular-meteor';

import { name as App } from '../imports/ui/components/app/app';

//Meteor.subscribe('docSearch', Session.get('searchQuery'));

angular.module('prototype2', [
  angularMeteor,
  App
]);