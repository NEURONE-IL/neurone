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
      var localTime = Utils.getTimestamp();

      var currentTimer = {
        userId: Meteor.userId(),
        username: Meteor.user().emails[0].address,
        startTimestamp: localTime,
        currentTimestamp: localTime,
        lastSyncLocalTimestamp: localTime
      };

      Meteor.call('syncFlowTimer', currentTimer, (err, res) => {
        if (!err) {
          console.log('Flow timer started!', res);
        }
        else {
          console.error('Error while starting Flow timer!', err);
        }
      });
    }
  }

  stopFlow() {

  }
}

const name = 'flowService';

export default angular.module(name, [])
.service('FlowService', FlowService);
