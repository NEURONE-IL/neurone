import Utils from '../../globalUtils';

import { UserData } from '../../../api/userData/index';

class UserDataService {
  constructor() {
    'ngInject';

    this.userDataObject = {};
    this._userData = null;
    this._isSubscribed = false;

    this.hdl = Meteor.subscribe('userData', {
      onReady: () => {
        this._isSubscribed = true;
        this._userData = UserData.findOne();
        Utils.logToConsole('UserDataService INIT!', this._userData);
      },
      onStop: () => {
        this._isSubscribed = false;
        this._userData = null;
      }
    });
    
    Meteor.autorun(() => {
      if (this.hdl.ready()) {
        this._userData = UserData.findOne();
        Utils.logToConsole('UserDataService AUTORUN!', this._userData);  
      }
    });
  }

  checkCallback(callback) {
    if (this.hdl.ready()) callback(null, true);
    else if (this.hdl.stop()) callback(null, false);
    else callback(false);
  }

  get() {
    if (this.hdl.ready()) {
      this._userData = UserData.findOne();
      Utils.logToConsole('UserDataService GET!', this._userData);
      return UserData.findOne();
    }
  }

  set(property) {
    if (this.hdl.ready()) {
      var dataId = this._userData._id;
      var dataObject = angular.copy(this._userData);
      angular.merge(dataObject, property);
      delete dataObject._id;
      UserData.update({ _id: dataId }, { $set: dataObject });
      Utils.logToConsole('Update!', dataId, dataObject, property, this._userData);
    }
  }
}

const name = 'userDataService';

export default angular.module(name, [])
.service('UserDataService', UserDataService);