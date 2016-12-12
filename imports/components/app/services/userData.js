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
    var dataId = this._userData._id;
    UserData.update({ _id: dataId }, { $set: { session: property }}, (err, res) => {
      if (!err) {
        Utils.logToConsole('UserDataService SESSION SET!', property);
      }
    });
  }
}

const name = 'userDataService';

export default angular.module(name, [])
.service('UserDataService', UserDataService);