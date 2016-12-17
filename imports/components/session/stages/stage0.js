import Utils from '../../globalUtils';

import template from './stage0.html';

class Stage0 {
  constructor($scope, $rootScope, $reactive, $translate, UserDataService) {
    'ngInject';

    this.$rootScope = $rootScope;

    this.uds = UserDataService;

    $scope.$on('$stateChangeStart', (event) => {
      this.uds.setSession({ readyButton: false });
      //this.uds.setSession({ stageHome: '/home' });
      this.uds.setSession({ statusMessage: '' });
    });

    $scope.$on('$stateChangeSuccess', (event) => {
      this.uds.setSession({ readyButton: true });
      this.uds.setSession({ stageHome: '/stage0' });
      this.uds.setSession({ stageNumber: 0 });

      this.$rootScope.$broadcast('updateNavigation');
    });

    $reactive(this).attach($scope);

    this.idea1 = '';
    this.idea2 = '';

    $rootScope.$on('readyStage0', (event, data) => {
      this.submit();
    });
  }

  submit() {
    var answer = {
      userId: Meteor.userId(),
      username: Meteor.user().username || Meteor.user().emails[0].address,
      action: 'ReadyStage0',
      clientTimestamp: Utils.getTimestamp(),
      extras: { answers: [ this.idea1, this.idea2 ] }
    };

    this.call('storeCustomEvent', answer, (err,res) => {
      if (!err) {
        console.log('Success!');
      }
      else {
        console.error('Error while saving Stage0 answers', err);
      }
    });
  }
}

const name = 'stage0';

// create a module
export default angular.module(name, [
])
.component(name, {
  template,
  controllerAs: name,
  controller: Stage0
})
.config(config);

function config($stateProvider) {
  'ngInject';

  $stateProvider.state('stage0', {
    url: '/stage0',
    template: '<stage0></stage0>',
    resolve: {
      currentUser($q) {
        if (Meteor.userId() === null) {
          return $q.reject('AUTH_REQUIRED');
        }
        else {
          return $q.resolve();
        }
      },
      user($auth) {
        return $auth.awaitUser();
      },
      userDataSub(UserDataService) {
        const uds = UserDataService;
        return uds.check();
      }
    }
  });
};