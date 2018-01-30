import Utils from '../globalUtils';
import Configs from '../globalConfigs';

class AuthService {
  constructor($rootScope, $translate, FlowService, UserDataService, SessionTrackService) {
    'ngInject';

    this.$rootScope = $rootScope;
    this.$translate = $translate;
    this.fs = FlowService;
    this.sts = SessionTrackService;
    this.uds = UserDataService;
  }

  login(user, password, callback) {
    Meteor.loginWithPassword(user, password, (err) => {
      if (err) {
        console.error('Login Error!', err);
        callback(err);
      }
      else {
        this.sts.saveLogin();

        var msg = { message: 'Login successful!' };  // TODO: Translate message
        callback(null, msg);
      }
    });
  }

  logout(callback) {
    this.sts.saveLogout();
    
    Accounts.logout((err) => {
      if (err) {
        console.error('Logout error!', err);
        callback(err);
      }
      else {
        if (Configs.flowEnabled) this.fs.stopFlow();
        this.uds.flush();

        var msg = { message: 'Logout successful!' };  // TODO: Translate message
        callback(null, msg);
      }
    });
  }

  register(credentials, callback) {
    Accounts.createUser(credentials, (err) => {
      if (err) {
        console.error('Register Error!', err);
        callback(err);
      }
      else {
        var msg = { message: 'Register successful!' };  // TODO: Translate message
        callback(null, msg);
      }
    });
  }

  resetPassword(credentials, callback) {
    Accounts.forgotPassword(credentials, (err) => {
      if (err) {
        console.error('Reset password Error!', err);
        callback(err);
      }
      else {
        var msg = { message: 'Reset password successful!' };  // TODO: Translate message
        callback(null, msg);
      }
    });
  }
}

const name = 'authService';

export default angular.module(name, [])
.service('AuthService', AuthService);
