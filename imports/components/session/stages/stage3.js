import angularTruncate from 'angular-truncate-2';

import ngWig from '../../../lib/ngWig/ng-wig';
import '../../../lib/ngWig/css/ng-wig.css';
import '../../../lib/ngWig/plugins/formats.ngWig';
import '../../../lib/ngWig/plugins/forecolor.ngWig';
import '../../../lib/ngWig/plugins/clear-styles.ngWig';

import Utils from '../../globalUtils';

import { UserBookmarks, UserSnippets } from '../../userCollections';

import { name as PageModal } from '../views/pageModal';

import template from './stage3.html';

const name = 'stage3';

class Stage3 {
  constructor($scope, $rootScope, $state, $reactive, $q, $promiser, $translate, $interval, $uibModal, UserDataService) {
    'ngInject';

    this.$state = $state;
    this.$scope = $scope;
    this.$interval = $interval;
    this.$uibModal = $uibModal;
    this.$translate = $translate;
    this.$rootScope = $rootScope;

    this.uds = UserDataService;

    $scope.$on('$stateChangeStart', (event) => {
      this.uds.setSession({ synthesis: false });
      this.uds.setSession({ readyButton: false });
      //this.uds.setSession({ stageHome: '/home' });
      this.uds.setSession({ statusMessage: '' });
    });

    $scope.$on('$stateChangeSuccess', (event) => {
      this.uds.setSession({ synthesis: true });
      this.uds.setSession({ stageHome: '/stage3' });
      this.uds.setSession({ stageNumber: 3 });

      this.$rootScope.$broadcast('updateNavigation');
    });

    $reactive(this).attach($scope);
    
    this.synthesisMessage = '';
    this.messageId = 'synthesisMessage';

    this.questionId = 'syn-pilot-en'; // TODO remove hardcoded value
    this.question = '';
    this.answer = '';
    this.docId = '';
    this.pageIndex = 0;
    this.autosave = {};

    this.startTime = Utils.getTimestamp();

    this.getQuestion();
    this.autosaveService();

    this.$rootScope.$on('readyStage3', (event, data) => {
      this.submit();
    });

    this.$onDestroy = () => {
      this.$interval.cancel(this.autosave);
    };

    this.helpers({
      pageList: () => {
        return UserBookmarks.find();
      },
      snippetListPerPage: () => {
        return UserSnippets.find({ docId: this.getReactively('docId') });
      },
      snippetListGlobal: () => {
        return UserSnippets.find();
      }
    });
  }

  changePage(index) {
    var pageList = UserBookmarks.find().fetch();

    this.docId = pageList[index].docId;
    this.pageIndex = index;

    console.log('changePage', this.docId, this.pageIndex);
  }

  launchPageModal(snippet) {
    console.log('pageModal', snippet.docId, snippet.snippedText);

    var modalInstance = this.$uibModal.open({
      animation: true,
      component: PageModal,
      size: 'lg',
      windowClass: 'modal-xl',
      resolve: {
        docId: () => {
          return snippet.docId;
        },
        snippet: () => {
          return snippet.snippedText;
        }
      }
    });
  }

  autosaveService() {
    this.autosave = this.$interval(() => {
      if (!!Meteor.userId()) {
        var answer = {
          userId: Meteor.userId(),
          username: Meteor.user().username || Meteor.user().emails[0].address,
          startTime: this.startTime,
          questionId: this.questionId,
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

        if (!Utils.isEmpty(this.answer)) this.uds.setSession({ readyButton: true });
      }
    }, Utils.sec2millis(30));
  }

  submit() {
    if (!!Meteor.userId()) {
      var answer = {
        userId: Meteor.userId(),
        username: Meteor.user().username || Meteor.user().emails[0].address,
        startTime: this.startTime,
        questionId: this.questionId,
        question: this.question,
        answer: this.answer,
        completeAnswer: true,
        localTimestamp: Utils.getTimestamp()
      };

      this.call('storeSynthesisAnswer', answer, (err, res) => {
        if (!err) {
          console.log('Answer submitted!', answer.userId, answer.localTimestamp);
          this.synthesisMessage = this.$translate.instant('synthesis.submitted');
          Utils.notificationFadeout(this.messageId);
        }
        else {
          console.error('Error while saving answer', err);
          this.synthesisMessage = this.$translate.instant('synthesis.error');
          Utils.notificationFadeout(this.messageId);
        }
      });

      this.$interval.cancel(this.autosave);
    }
  }

  getQuestion() {
    if (!!Meteor.userId()) {
      this.call('getSynthQuestion', Utils.parseStringAsInteger(this.questionId), (err, res) => {
        if (!err) {
          this.question = res.question;
        }
        else {
          console.error('Error while loading question', err);
          this.question = 'No question';
        }
      });
    }
  }
}

// create a module
export default angular.module(name, [
  'truncate',
  PageModal
])
.component(name, {
  template,
  controllerAs: name,
  controller: Stage3
})
.config(ngWigConfig)
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
      user($auth) {
        return $auth.awaitUser();
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

function ngWigConfig(ngWigToolbarProvider) {
  'ngInject';

  ngWigToolbarProvider.addStandardButton('underline', 'Underline', 'underline', 'fa-underline');
};