import { Meteor } from 'meteor/meteor';

import Utils from '../utils/serverUtils';

import { Settings } from '../../imports/database/settings/index';

// NEURONE API: Configs Setter
// Methods for modifying settings for simulation from the server

Meteor.methods({
  // dgacitua: Create environment settings
  //           PARAMS:
  //           RETURNS:
  createEnvSettings: function(settingsObject) {
    try {
      return true;
    }
    catch (err) {
      throw new Meteor.Error(582, 'Error creating Environment Settings!', err);
    }
  },
  // dgacitua: Create client settings
  //           PARAMS:
  //           RETURNS:
  createClientSettings: function(settingsObject) {
    try {
      return true;
    }
    catch (err) {
      throw new Meteor.Error(583, 'Error creating Client Settings!', err);
    }
  },
  createFlowSettings: function(settingsObject) {
    try {
      return true;
    }
    catch (err) {
      throw new Meteor.Error(584, 'Error creating Flow Settings!', err);
    }
  },
  stub: function() {
    try {
      return true;
    }
    catch (err) {
      throw new Meteor.Error(581, 'Error!', err);
    }
  }
});