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