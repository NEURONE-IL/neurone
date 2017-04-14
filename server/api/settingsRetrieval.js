import { Meteor } from 'meteor/meteor';

import Utils from '../lib/utils';

import { UserData } from '../../imports/database/userData/index';
import { Settings } from '../../imports/database/settings/index';
import { Identities } from '../../imports/database/identities/index';

Meteor.methods({
  // dgacitua: Get user data from its userId
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
      throw new Meteor.Error(531, 'Could not get User Data from userId!', err);
    }
  },
  // dgacitua: Get user role from logged client
  userRole: function() {
    try {
      if (this.userId) {
        return UserData.findOne({ userId: this.userId }).role;
      }
      else {
        return '';
      }
    }
    catch (err) {
      throw new Meteor.Error(532, 'Could not read user session!', err);
    }
  },
  // dgacitua: Get user session (temporal state variables) from logged client
  userSession: function() {
    try {
      if (this.userId) {
        return UserData.findOne({ userId: this.userId }).session;
      }
      else {
        return {};
      }
    }
    catch (err) {
      throw new Meteor.Error(533, 'Could not read user session!', err);
    }
  },
  // dgacitua: Get user configs (flow execution data) from logged client
  userConfigs: function() {
    try {
      if (this.userId) {
        return UserData.findOne({ userId: this.userId }).configs;
      }
      else {
        return {};
      }
    }
    catch (err) {
      throw new Meteor.Error(534, 'Could not read user configs!', err);
    }
  },
  // dgacitua: Set user session (temporal state variables) from logged client and return them
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
      throw new Meteor.Error(535, 'Could not update user session!', err);
    }
  },
  // dgacitua: Get initial user configs for new created user from client
  initialConfigs: function(domain, task) {
    try {
      var envSettings = Settings.findOne({ envSettingsId: 'default' }),
         flowSettings = null;

      if (!!task && !!domain) {
        flowSettings = Settings.findOne({ task: task, domain: domain });
      }
      else {
        flowSettings = Settings.findOne({ flowSettingsId: envSettings.flowSettings }); 
      }

      delete flowSettings._id;

      return flowSettings;
    }
    catch (err) {
      throw new Meteor.Error(536, 'Could not read initial user configs!', err);
    }
  },
  // dgacitua: Get client settings (basic configs for NEURONE simulation) from client
  clientSettings: function() {
    try {
      var envSettings = Settings.findOne({ envSettingsId: 'default' }),
       clientSettings = Settings.findOne({ clientSettingsId: envSettings.clientSettings });

      delete clientSettings._id;

      return clientSettings;
    }
    catch (err) {
      throw new Meteor.Error(537, 'Could not read NEURONE client configs!', err);
    }
  },
  // dgacitua: Massive enrollment method for creating multiple user accounts
  registerUsers: function(userList) {
    check(userList, Array);

    userList.forEach((user, idx, arr) => {
      let tempCredentials = {
        username: user.username,
        password: user.password,
        role: 'student',
        configs: {},
        session: {},
        profile: {}
      };

      // TODO Undo hardcode of domain and tasks
      let domain, task, flowSettings;

      if (user.domain === 'SS') domain = 'social';
      else if (user.domain === 'SC') domain = 'science';
      else domain = 'pilot';

      if (user.task === 'E') task = 'email';
      else if (user.task === 'A') task = 'article';
      else task = 'pilot';

      flowSettings = Settings.findOne({ task: task, domain: domain });

      if (!(!!flowSettings)) {
        arr[idx].status = 'ConfigError';
      }
      else {
        tempCredentials.configs = flowSettings;

        let id = Accounts.createUser(tempCredentials);

        if (!(!!id)) {
          arr[idx].status = 'RegisterError';
        }
        else {
          arr[idx].status = 'Registered';
        }
      }
    });

    return userList;
  },
  registerIdentity: function(id) {
    try {
      check(id, String);

      if (this.userId) {
        var time = Utils.getTimestamp();

        var identity = {
          userId: this.userId,
          username: Meteor.user().username,
          identity: id,
          serverDate: Utils.timestamp2date(time),
          serverTime: Utils.timestamp2time(time),
          serverTimestamp: time
        };

        var result = Identities.insert(identity);
       
        if (!!result) return identity;
        else return false;
      }
    }
    catch (err) {
      console.error(err);
      throw new Meteor.Error(538, 'Could not register new user!', err);
    }
  }
});