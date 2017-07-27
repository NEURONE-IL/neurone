import { Meteor } from 'meteor/meteor';

import Utils from '../utils/serverUtils';
import Users from '../utils/userUtils';

import { Settings } from '../../imports/database/settings/index';
import { FlowComponents } from '../../imports/database/flowComponents/index';

// NEURONE API: Configs Setter
// Methods for modifying settings for simulation from the server

const flowComponentPattern = { _id: Match.Maybe(String), type: String, name: String, properties: Object };

Meteor.methods({
  // dgacitua: Create environment settings
  //           PARAMS:
  //           RETURNS:
  createEnvSettings: function(settingsObject) {
    try {
      return { status: 'success' };
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
      return { status: 'success' };
    }
    catch (err) {
      throw new Meteor.Error(583, 'Error creating Client Settings!', err);
    }
  },
  createFlowSettings: function(settingsObject) {
    try {
      return { status: 'success' };
    }
    catch (err) {
      throw new Meteor.Error(584, 'Error creating Flow Settings!', err);
    }
  },
  getFlowComponents: function() {
    try {
      return FlowComponents.find().fetch();
    }
    catch (err) {
      throw new Meteor.Error(585, 'Error while getting FlowComponents!', err);
    }
  },
  setFlowComponent: function(flowComponent) {
    try {
      check(flowComponent, flowComponentPattern);
      FlowComponents.upsert(flowComponent._id, flowComponent);
      return { status: 'success' };
    }
    catch (err) {
      throw new Meteor.Error(586, 'Error while saving FlowComponent!', err);
    }
  },
  deleteFlowComponent: function(id) {
    try {
      check(id, String);
      FlowComponents.remove(id);
      return { status: 'success' };
    }
    catch (err) {
      throw new Meteor.Error(587, 'Error while deleting FlowComponent!', err);
    }
  },
  stub: function() {
    try {
      return { status: 'success' };
    }
    catch (err) {
      throw new Meteor.Error(581, 'Error!', err);
    }
  }
});