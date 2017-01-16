import { Meteor } from 'meteor/meteor';

import Utils from '../lib/utils';

import { UserData } from '../../imports/api/userData/index';
import { Settings } from '../../imports/api/settings/index';

Meteor.methods({
  userDataFromId: function(userId) {
    // dgacitua: Server-only method
    // https://github.com/themeteorchef/server-only-methods
    try {
      check(userId, String);

      console.log(Meteor.users.findOne({ _id: userId }).username);
      if (this.connection == null) return Meteor.users.findOne({ _id: userId });
      else return undefined;
    }
    catch (err) {
      throw new Meteor.Error('UserDataError', 'Could not get User Data from userId!', err);
    }
  },
  userSession: function() {
    try {
      if (this.userId) {
        //var met = Meteor.wrapAsync(UserData.findOne),
        //   call = met({ userId: this.userId });

        //return call.session;
        return UserData.findOne({ userId: this.userId }).session;
      }
      else {
        return {};
      }
    }
    catch (err) {
      throw new Meteor.Error('UserDataError', 'Could not read user session!', err);
    }
  },
  userConfigs: function() {
    try {
      if (this.userId) {
        //var met = Meteor.wrapAsync(UserData.findOne),
        //   call = met({ userId: this.userId });

        //return call.configs;
        return UserData.findOne({ userId: this.userId }).configs;
      }
      else {
        return {};
      }
    }
    catch (err) {
      throw new Meteor.Error('UserDataError', 'Could not read user configs!', err);
    }
  },
  setSession: function(property) {
    try {
      if (this.userId) {
        var setObj = {};

        for (var key in property) {
          setObj['session.' + key] = property[key];
        }
        
        UserData.update({ userId: this.userId }, { $set: setObj });
        
        return UserData.findOne({ userId: this.userId }).session;
      }
    }
    catch (err) {
      throw new Meteor.Error('UserDataError', 'Could not update user session!', err);
    }
  },
  initialConfigs: function() {
    try {
      var envSettings = Settings.findOne({ envSettingsId: 'default' }),
         userSettings = Settings.findOne({ userSettingsId: envSettings.userSettings });

      delete userSettings._id;

      return userSettings;
    }
    catch (err) {
      throw new Meteor.Error('UserDataError', 'Could not read initial user configs!', err);
    }
  }
});