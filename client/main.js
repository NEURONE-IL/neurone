import angular from 'angular';
import angularMeteor from 'angular-meteor';

import { name as App } from '../imports/components/app/app';

angular.module('neurone', [
  angularMeteor,
  App
]);

Meteor.startup(() => {
  // dgacitua: Sync server time
  TimeSync.isSynced();

  // dgacitua: User presence tracker
  UserPresence.awayOnWindowBlur = true;
  //UserPresence.awayTime = 30000;
  UserPresence.start();
});