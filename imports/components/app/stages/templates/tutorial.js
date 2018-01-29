import Utils from '../../../globalUtils';
import Configs from '../../../globalConfigs';

import template from './tutorial.html';

class Tutorial {
  constructor($scope, $rootScope, $reactive, $translate, $timeout, UserDataService) {
    'ngInject';

    this.$timeout = $timeout;
    this.$rootScope = $rootScope;

    this.uds = UserDataService;

    $scope.$on('$stateChangeStart', (event) => {
      Session.set('lockButtons', true);

      this.uds.setSession({
        readyButton: false,
        statusMessage: ''
      }, (err, res) => {
        if (!err) {
          // dgacitua: Do nothing for now
        }
        else {
          console.error('Error while unloading Stage!', err);
        }
      });
    });

    $scope.$on('$stateChangeSuccess', (event) => {
      this.uds.setSession({
        readyButton: false,
        statusMessage: '',
        stageHome: '#'
      }, (err, res) => {
        if (!err) {
          var stageNumber = this.uds.getSession().currentStageNumber,
             currentStage = this.uds.getConfigs().stages[stageNumber];

          //this.uds.setSession({ currentStageName: currentStage.id, currentStageState: currentStage.state });
          this.$rootScope.$broadcast('updateNavigation');

          console.log('Tutorial loaded!');
        }
        else {
          console.error('Error while loading Stage!', err);
        }
      });
    });

    $reactive(this).attach($scope);

    var stageNumber = this.uds.getSession().currentStageNumber;

    this.avatar = this.uds.getConfigs().avatar;
    
    // this.page = this.uds.getConfigs().stages[stageNumber].page;
    this.slides = this.uds.getConfigs().stages[stageNumber].slides;

    this.$timeout(() => {
      this.uds.setSession({ readyButton: true });
    }, Configs.instructionTimeout);
  }
}

const name = 'tutorial';

export default angular.module(name, [
])
.component(name, {
  template: template.default,
  controllerAs: name,
  controller: Tutorial
})
.config(config);

function config($stateProvider) {
  'ngInject';

  $stateProvider.state('tutorial', {
    url: '/tutorial?stage',
    template: '<tutorial></tutorial>',
    resolve: {
      dataReady($q, UserDataService) {
        var uds = UserDataService;
        return uds.ready().then((status) => {
          if (status === 'USER_LOGGED') return $q.resolve();
          else return $q.reject('USERDATA_NOT_LOADED');
        });
      },
      stageLock($q, UserDataService, dataReady) {
        if (Meteor.userId() === null) {
          return $q.reject('AUTH_REQUIRED');
        }
        else {
          var uds = UserDataService,
              dfr = uds.ready();

          return dfr.then((res) => {
            var cstn = uds.getSession().currentStageNumber,
                csst = uds.getConfigs().stages[cstn].state,
                cstp = uds.getConfigs().stages[cstn].urlParams,
                stst = 'tutorial';

            if (csst !== stst) return $q.reject('WRONG_STAGE');
            else return $q.resolve();
          });
        }
      }
    }
  });
};