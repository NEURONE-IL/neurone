import Utils from '../../globalUtils';
import Configs from '../../globalConfigs';

class AuthService {
  constructor(FlowService, SessionTrackService) {
    'ngInject';

    this.fs = FlowService;
    this.sts = SessionTrackService;

    this.threshold = Utils.sec2millis(Configs.idleThreshold);
    this.interval = Utils.sec2millis(Configs.idleCheckInterval);
    this.idleOnBlur = Configs.idleOnBlur;
  }

  login(email, password, callback) {
    Meteor.loginWithPassword(email, password, (err) => {
      if (err) {
        console.error('Login Error!', err);
        callback(err);
      } else {
        //console.log(Meteor.user(), Meteor.user().emails[0].address);
        this.sts.saveLogin();
        this.fs.startFlow();
        UserStatus.startMonitor({ threshold: this.threshold, interval: this.interval, idleOnBlur: this.idleOnBlur });

        var msg = { message: 'Login successful!' };  // TODO: Translate message
        callback(null, msg);
      }
    });
  }

  logout(callback) {
    this.fs.stopFlow();
    this.sts.saveLogout();
    //UserStatus.stopMonitor();
    
    Accounts.logout((err) => {
      if (err) {
        console.error('Logout error!', err);
        callback(err);
      }
      else {
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
