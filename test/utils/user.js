import { Meteor } from 'meteor/meteor';
import { DDP } from 'meteor/ddp-client';

export default class User {
  static mockResearcher(callback) {
    let credentials = {
      username: 'Admin',
      email: 'admin@neurone.info',
      password: '1234',
      role: 'researcher',
      configs: { flowSettingsId: 'pilot', locale: 'en', task: 'pilot', domain: 'pilot' },
      session: {},
      profile: {}
    };

    Accounts.createUser(credentials, (err) => {
      if (err) {
        callback(err);
      }
      else {
        Meteor.loginWithPassword(credentials.username, credentials.password, (err2) => {
          if (err2) callback(err2);
          else callback(null, credentials);
        });
      }
    });
  }

  static mockStudent(callback) {
    let credentials = {
      username: 'Student',
      email: '',
      password: '5678',
      role: 'student',
      configs: { flowSettingsId: 'pilot', locale: 'en', task: 'pilot', domain: 'pilot' },
      session: {},
      profile: {}
    };

    Accounts.createUser(credentials, (err) => {
      if (err) {
        callback(err);
      }
      else {
        Meteor.loginWithPassword(credentials.username, credentials.password, (err2) => {
          if (err2) callback(err2);
          else callback(null, credentials);
        });
      }
    });
  }

  static login(username, password, callback) {
    Meteor.loginWithPassword(username, password, (err) => {
      if (err) callback(err);
      else callback(null, true);
    });
  }

  static logout(callback) {
    Meteor.logout((err) => {
      if (err) callback(err);
      else callback(null, true);
    });
  }
}