import Utils from '../../globalUtils';

import { UserData } from '../../../api/userData/index';

class UserDataService {
  constructor($promiser) {
    'ngInject';

    this.userDataObject = {};
    this._userData = null;
    this._isSubscribed = false;

    this.hdl = $promiser.subscribe('userData');
    
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
}

const name = 'userDataService';

export default angular.module(name, [])
.service('UserDataService', UserDataService);