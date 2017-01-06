import Utils from '../../globalUtils';

import { UserData } from '../../../api/userData/index';

class UserDataService {
  constructor($promiser) {
    'ngInject';

    this.$promiser = $promiser;

    this.hdl = {};
    this.userId = Meteor.userId();
    this.subscribe(this.userId);
    

    Meteor.autorun(() => {
      // dgacitua: Subscribe user to MiniMongo userData Collection and return handle object as a promise
      this.userId = Meteor.userId();
      this.stopSubscription();
      this.subscribe(this.userId);
    });
  }

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

  getSession() {
    //return this.hdl.then((res) => {
    //  return UserData.findOne().session;
    //});

    if (!!Meteor.userId()) return UserData.findOne().session;
    else return {};
    //return UserData.findOne().session;
  }

  getConfigs() {
    //return this.hdl.then((res) => {
    //  return UserData.findOne().configs;
    //});

    if (!!Meteor.userId()) return UserData.findOne().configs;
    else return {};
    //return UserData.findOne().configs;
  }

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

  setSession(property) {
    this.hdl.then((res) => {
      // dgacitua: If user is logged and subscription is ready
      if (!!Meteor.userId() && res.ready()) {
      
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
      }
    });
  }

  // dgacitua: stage functions
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
}

const name = 'userDataService';

export default angular.module(name, [])
.service('UserDataService', UserDataService);