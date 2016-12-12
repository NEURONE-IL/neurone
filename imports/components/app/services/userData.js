import Utils from '../../globalUtils';

import { UserData } from '../../../api/userData/index';

class UserDataService {
  constructor($promiser) {
    'ngInject';

    this.hdl = $promiser.subscribe('userData');

    this._userData = null;

    Meteor.autorun(() => {
      this._userData = UserData.findOne();
    });
  }

  check() {
    return this.hdl;
  }

  get() {
    return UserData.findOne();
  }

  getSession() {
    return UserData.findOne().session;
  }

  getConfigs() {
    return UserData.findOne().configs;
  }

  set(property) {
    var dataId = this._userData._id;
    UserData.update({ _id: dataId }, { $set: property }, (err, res) => {
      if (!err) {
        Utils.logToConsole('UserDataService SET!', property);
      }
    });
  }

  setSession(property) {
    // dgacitua: http://stackoverflow.com/a/2958894
    var dataId = this._userData._id;
    var setObj = {};

    for (var key in property) {
      setObj['session.' + key] = property[key];
    }
    
    UserData.update({ _id: dataId }, { $set: setObj }, (err, res) => {
      if (!err) {
        console.log('UserDataService SESSION SET!', setObj);
      }
    });
  }

  initUserData() {
    this._userData = UserData.findOne();
    
    if (Meteor.user() && !this._userData) {
      var data = {
        userId: Meteor.userId(),
        role: Meteor.user().role || Meteor.user().profile.role || 'undefined',
        configs: {
          locale: Settings.locale || 'en',
          task: '',
          topic: '',
          maxBookmarks: Settings.maxBookmarks || 3,
          snippetsPerPage: Settings.snippetsPerPage || 3,
          snippetLength: Settings.snippetLength || 15
        },
        session: {
          docId: '',
          bookmarkCount: 0,
          snippetCount: 0
        },
        profile: {}
      }

      UserData.insert(data, (err, res) => {
        console.log('UserDataService INIT DATA!', res); 
      });
    }
  }
}

const name = 'userDataService';

export default angular.module(name, [])
.service('UserDataService', UserDataService);