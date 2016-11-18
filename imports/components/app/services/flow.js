import Utils from '../../globalUtils';

class FlowService {
  constructor($window) {
    'ngInject';

    this.$window = $window;
  }

  syncFlow() {
    
  }


  startFlow() {
    if (!!Meteor.userId()) {
      var currentTimer = {
        userId: Meteor.userId(),
        username: Meteor.user().emails[0].address,
        startTimestamp: Utils.getTimestamp(),
        currentTimestamp: Utils.getTimestamp(),
        lastSyncTimestamp: Utils.getTimestamp()
      };
    }
  }

  stopFlow() {

  }
}

const name = 'flowService';

export default angular.module(name, [])
.service('FlowService', FlowService);
