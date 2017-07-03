/*

NEURONE: oNlinE inqUiRy experimentatiON systEm
Copyright (C) 2017  Daniel Gacitua

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as published
by the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.

*/

import './utils/buffer';
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