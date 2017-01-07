import Utils from '../../globalUtils';

import { UserData } from '../../../api/userData/index';

class UserDataService {
  constructor($rootScope, $promiser) {
    'ngInject';

    this.$promiser = $promiser;
    this.$rootScope = $rootScope;

    this.userId = Meteor.userId();
    this.hdl = {}; //this.$promiser.subscribe('userDataToggle', userId);
    
    this.userSession = new ReactiveObj();
    this.userConfigs = new ReactiveObj();

    Meteor.autorun(() => {
      this.userId = Meteor.userId();

      if (!!this.userId) {
        console.log('UserData AUTORUN!');
        this.fetchConfigs();
        this.fetchSession();
      }
      else {
        console.log('UserData FLUSH!');
        this.flush();
      }
    });
  }

  /*
  check() {
    return this.hdl;
  }

  ready() {
    return this.hdl.then((handle) => {
      return handle.ready();
    });
  }

  subscribe(userId) {
    this.hdl = this.$promiser.subscribe('userDataToggle', userId);
    console.log('UserData Subscription!', userId);
  }

  stopSubscription() {
    this.hdl.then((handle) => {
      handle.stop();
    });
  }

  get() {
    //return this.hdl.then((res) => {
    //  return UserData.findOne();
    //});

    if (!!Meteor.userId()) return UserData.findOne();
    else return {};
    //return UserData.findOne();
  }
  */

  fetchSession() {
    Meteor.call('userSession', (err, res) => {
      if (!err) {
        for (var p in res) {
          if (res.hasOwnProperty(p)) {
            this.userSession.set(p, res[p]);
          }
        }
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
        for (var p in res) {
          if (res.hasOwnProperty(p)) {
            this.userConfigs.set(p, res[p]);
          }
        }
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

  /*
  set(property) {
    this.hdl.then((res) => {
      // dgacitua: If user is logged and subscription is ready
      if (!!Meteor.userId() && res.ready()) {
        var dataId = UserData.findOne()._id;
        UserData.update({ _id: dataId }, { $set: property }, (err, res) => {
          if (!err) {
            //Utils.logToConsole('UserDataService SET!', property);
          }
        });
      }
    });
  }
  */

  setSession(property) {
    //this.hdl.then((res) => {
      // dgacitua: If user is logged and subscription is ready
      if (!!Meteor.userId()) {
        Meteor.call('setSession', property, (err, res) => {
          if (!err) {
            Meteor.call('userSession', (err2, res2) => {
              if (!err2) {
                for (var p in res2) {
                  if (res2.hasOwnProperty(p)) {
                    this.userSession.set(p, res2[p]);
                  }
                }
                //console.log('setSession', property, this.userSession);
                //this.$rootScope.$broadcast('updateSession');
              }
              else {
                console.error(err);
              }
            });
          }
          else {
            console.error(err);
          }
        });
      }
    //});
  }

  // dgacitua: stage functions
  /*
  getStages() {
    return this.hdl.then((res) => {
      return UserData.findOne().configs.stages;
    });    
  }

  getCurrentStage() {
    return this.hdl.then((res) => {
      return UserData.findOne().session.stageNumber;
    });
  }

  stageId2Pos(stageId) {
    return this.hdl.then((res) => {
      var stages = UserData.findOne().session.stages,
              st = stages.find({id: stageId}),
             idx = stages.indexOf(st);

      return idx;
    });
  }

  stagePos2Id(stagePosition) {
    return this.hdl.then((res) => {
      return UserData.findOne().session.stages[stagePosition].id;
    });
  }

  getCurrentStageData() {
    return this.hdl.then((res) => {
      var cs = UserData.findOne().session.stageNumber,
          sd = UserData.findOne().session.stageNumber[cs];

      return sd;
    });
  }

  setCurrentStage(stageId) {
    this.hdl.then((res) => {
      var stages = UserData.findOne().session.stages,
              st = stages.find({id: stageId}),
             idx = stages.indexOf(st);

      this.setSession({stageNumber: idx});
    });
  }
  */
}

const name = 'userDataService';

export default angular.module(name, [])
.service('UserDataService', UserDataService);