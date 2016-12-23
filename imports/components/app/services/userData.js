import Utils from '../../globalUtils';

import { UserData } from '../../../api/userData/index';

class UserDataService {
  constructor($promiser) {
    'ngInject';

    Meteor.autorun(() => {
      var userId = Meteor.userId();
      this.hdl = $promiser.subscribe('userDataToggle', userId);
      //console.log('UserDataService AUTORUN!', userId);
    });
  }

  check() {
    return this.hdl;
  }

  get() {
    if (!!Meteor.userId()) return UserData.findOne();
    else return {};
  }

  getSession() {
    if (!!Meteor.userId()) return UserData.findOne().session;
    else return {};
  }

  getConfigs() {
    if (!!Meteor.userId()) return UserData.findOne().configs;
    else return {};
  }

  set(property) {
    if (!!Meteor.userId()) {
      this.hdl.then((res) => {
        var dataId = UserData.findOne()._id;
        UserData.update({ _id: dataId }, { $set: property }, (err, res) => {
          if (!err) {
            //Utils.logToConsole('UserDataService SET!', property);
          }
        });
      });
    }
  }

  setSession(property) {
    if (!!Meteor.userId()) {
      this.hdl.then((res) => {
        // dgacitua: http://stackoverflow.com/a/2958894
        var dataId = UserData.findOne()._id;
        var setObj = {};

        for (var key in property) {
          setObj['session.' + key] = property[key];
        }
        
        UserData.update({ _id: dataId }, { $set: setObj }, (err, res) => {
          if (!err) {
            //console.log('UserDataService SESSION SET!', setObj);
          }
        });
      });
    }
  }
}

const name = 'userDataService';

export default angular.module(name, [])
.service('UserDataService', UserDataService);