import angularTruncate from 'angular-truncate-2';

import ngWig from '../../../lib/ngWig/ng-wig';
import '../../../lib/ngWig/css/ng-wig.css';
import '../../../lib/ngWig/plugins/formats.ngWig';
import '../../../lib/ngWig/plugins/forecolor.ngWig';
import '../../../lib/ngWig/plugins/clear-styles.ngWig';

import Utils from '../../globalUtils';

import { UserBookmarks, UserSnippets } from '../../userCollections';

import template from './stage3.html';

const name = 'stage3';

class Stage3 {
  constructor($scope, $rootScope, $state, $reactive, $q, $promiser, $interval, UserDataService) {
    'ngInject';

    this.$state = $state;
    this.$scope = $scope;
    this.$interval = $interval;
    this.$rootScope = $rootScope;

    this.uds = UserDataService;

    $scope.$on('$stateChangeStart', (event) => {
      this.uds.setSession({ synthesis: false });
      this.uds.setSession({ readyButton: false });
      this.uds.setSession({ stageHome: '/home' });
    });

    $scope.$on('$stateChangeSuccess', (event) => {
      this.uds.setSession({ synthesis: true });
      this.uds.setSession({ stageHome: '/stage3' });
      this.uds.setSession({ stageNumber: 3 });

      this.$rootScope.$broadcast('updateNavigation');
    });

    $reactive(this).attach($scope);

    this.autosave = {};

    this.autosaveService();
    this.startTime = Utils.getTimestamp();

    this.$onDestroy = () => {
      this.$interval.cancel(this.autosave);
    };
  }

  autosaveService() {
    this.autosave = this.$interval(() => {
      if (!!Meteor.userId()) {
        var answer = {
          userId: Meteor.userId(),
          username: Meteor.user().username || Meteor.user().emails[0].address,
          startTime: this.startTime,
          questionId: this.$stateParams.id,
          question: this.question,
          answer: this.answer,
          completeAnswer: false,
          localTimestamp: Utils.getTimestamp()
        };

        this.call('storeSynthesisAnswer', answer, (err, res) => {
          if (!err) {
            console.log('Answer autosaved!', answer.userId, answer.localTimestamp);
            this.synthesisMessage = this.$translate.instant('synthesis.saved');
            Utils.notificationFadeout(this.messageId);
          }
          else {
            console.error('Unknown Error', err);
            this.synthesisMessage = this.$translate.instant('synthesis.error');
            Utils.notificationFadeout(this.messageId);
          }
        });
      }
    }, Utils.sec2millis(30));
  }
}

// create a module
export default angular.module(name, [
  'truncate'
])
.component(name, {
  template,
  controllerAs: name,
  controller: Stage3
})
.config(config);

function config($stateProvider) {
  'ngInject';

  $stateProvider.state('stage3', {
    url: '/stage3',
    template: '<stage3></stage3>',
    resolve: {
      currentUser($q) {
        if (Meteor.userId() === null) {
          return $q.reject('AUTH_REQUIRED');
        }
        else {
          return $q.resolve();
        }
      },
      userDataSub(UserDataService) {
        const uds = UserDataService;
        return uds.check();
      },
      userBookmarksSub($promiser) {
        return $promiser.subscribe('userBookmarks');
      },
      userSnippetsSub($promiser) {
        return $promiser.subscribe('userSnippets');
      }
    }
  })
};