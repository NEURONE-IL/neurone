import Utils from '../globalUtils';
import Configs from '../globalConfigs';

class UserDataService {
  constructor() {
    'ngInject';

    this.userId = Meteor.userId();
    
    // dgacitua: https://github.com/xamfoo/reactive-obj
    this.userSession = new ReactiveObj();
    this.userConfigs = new ReactiveObj();

    Meteor.autorun(() => {
      this.userId = Meteor.userId();

      if (!!this.userId) {
        console.log('UserData AUTORUN!', this.userId);
        this.fetchConfigs();
        this.fetchSession();
      }
      else {
        console.log('UserData FLUSH!');
        this.flush();
      }
    });
  }

  fetchSession() {
    Meteor.call('userSession', (err, res) => {
      if (!err) {
        Object.keys(res).map((p) => this.userSession.set(p, res[p]));
        console.log('Session', this.userSession);
      }
      else {
        console.error(err);
      }
    });
  }

  fetchConfigs() {
    Meteor.call('userConfigs', (err, res) => {
      if (!err) {
        Object.keys(res).map((p) => this.userConfigs.set(p, res[p]));
        console.log('Configs', this.userConfigs);
      }
      else {
        console.error(err);
      }
    });
  }

  getSession() {
    return this.userSession.get();
  }

  getConfigs() {
    return this.userConfigs.get();
  }

  flush() {
    this.userSession.set([], {});
    this.userConfigs.set([], {});
  }

  setSession(property, callback) {
    if (!!Meteor.userId()) {
      Meteor.call('setSession', property, (err, res) => {
        if (!err) {
          Object.keys(res).map((p) => this.userSession.set(p, res[p]));
          typeof callback === 'function' && callback(null, property);
          /*
          Meteor.call('userSession', (err2, res2) => {
            if (!err2) {
              Object.keys(res2).map((p) => this.userSession.set(p, res2[p]));
              //console.log('SessionSet', property);
              typeof callback === 'function' && callback(null, property);
            }
            else {
              console.error(err);
              typeof callback === 'function' && callback(err);
            }
          });
          */
        }
        else {
          console.error(err);
          typeof callback === 'function' && callback(err);
        }
      });
    }
  }
}

const name = 'userDataService';

export default angular.module(name, [])
.service('UserDataService', UserDataService);