import Utils from '../globalUtils';
import Configs from '../globalConfigs';

class UserDataService {
  constructor($q, $translate) {
    'ngInject';

    this.$q = $q;
    this.$translate = $translate;

    this.userId = Meteor.userId();
    this.udsp = this.$q.defer();
    
    // dgacitua: https://github.com/xamfoo/reactive-obj
    this.userSession = new ReactiveObj();
    this.userConfigs = new ReactiveObj();
    this.role = '';

    Meteor.autorun(() => {
      this.userId = Meteor.userId();
      this.autorun(this.userId);
    });
  }

  ready() {
    return this.udsp.promise;
  }

  autorun(userId) {
    this.udsp = this.$q.defer();

    if (!!userId) {
      //console.log('UserData AUTORUN!', userId);
      
      var p1 = this.fetchConfigs(),
          p2 = this.fetchSession(),
          p3 = this.fetchRole();

      this.$q.all([p1, p2, p3]).then(
        (res) => {
          this.changeLocale();
          this.udsp.resolve('USER_LOGGED');
        },
        (err) => {
          this.udsp.reject('CANNOT_LOAD_USERDATA');
        }
      );
    }
    else {
      this.flush();
      this.changeLocale();
      this.udsp.reject('USER_NOT_LOGGED');
    }
  }

  fetchSession() {
    var dfr = this.$q.defer();

    Meteor.call('userSession', (err, res) => {
      if (!err) {
        Object.keys(res).map((p) => this.userSession.set(p, res[p]));
        //console.log('Session', this.userSession);
        dfr.resolve();
      }
      else {
        console.error(err);
        dfr.reject();
      }
    });

    return dfr.promise;
  }

  fetchConfigs() {
    var dfr = this.$q.defer();

    Meteor.call('userConfigs', (err, res) => {
      if (!err) {
        Object.keys(res).map((p) => this.userConfigs.set(p, res[p]));
        //console.log('Configs', this.userConfigs);
        dfr.resolve();
      }
      else {
        console.error(err);
        dfr.reject();
      }
    });

    return dfr.promise;
  }

  fetchRole() {
    var dfr = this.$q.defer();

    Meteor.call('userRole', (err, res) => {
      if (!err) {
        this.role = res;
        Session.set('userRole', this.role);
        dfr.resolve();
      }
      else {
        this.role = '';
        Session.set('userRole', this.role);
        console.error(err);
        dfr.reject();
      }
    });

    return dfr.promise;
  }

  getSession() {
    return this.userSession.get();
  }

  getConfigs() {
    return this.userConfigs.get();
  }

  getRole() {
    return this.role;
  }

  changeLocale() {
    let locale = this.getConfigs().locale;
    this.$translate.use(locale);
    Session.set('locale', locale);
    console.log('Changing Locale!', locale);
  }

  flush() {
    var dfr = this.$q.defer();

    this.userSession.set([], {});
    this.userConfigs.set([], {});
    this.role = '';

    Session.set('locale', 'en');
    Session.set('userRole', this.role);

    return dfr.resolve();
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