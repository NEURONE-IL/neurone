import angularTruncate from 'angular-truncate-2';

import ngWig from '../../../utils/ngWig/ng-wig';
import '../../../utils/ngWig/css/ng-wig.css';
import '../../../utils/ngWig/plugins/formats.ngWig';
import '../../../utils/ngWig/plugins/forecolor.ngWig';
import '../../../utils/ngWig/plugins/clear-styles.ngWig';

import Utils from '../../globalUtils';
import Configs from '../../globalConfigs';

import { UserBookmarks, UserSnippets } from '../../userCollections';

import { name as PageModal } from '../views/pageModal';

import template from './synthesis.html';

const name = 'synthesis';

class Synthesis {
  constructor($scope, $rootScope, $state, $reactive, $q, $timeout, $translate, $interval, $uibModal, UserDataService, EventTrackService) {
    'ngInject';

    this.$state = $state;
    this.$scope = $scope;
    this.$interval = $interval;
    this.$uibModal = $uibModal;
    this.$translate = $translate;
    this.$rootScope = $rootScope;

    this.uds = UserDataService;
    this.ets = EventTrackService;

    $scope.$on('$stateChangeStart', (event) => {
      Session.set('lockButtons', true);

      this.uds.setSession({
        synthesis: false,
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
        synthesis: true,
        stageHome: '/synthesis'
      }, (err, res) => {
        if (!err) {
          this.$rootScope.$broadcast('updateNavigation');
          console.log('Synthesis loaded!');
        }
        else {
          console.error('Error while loading Stage!', err);
        }
      });
    });

    $reactive(this).attach($scope);

    let stageNumber = this.uds.getSession().currentStageNumber,
       currentStage = this.uds.getConfigs().stages[stageNumber],
               form = currentStage.form;

    this.avatar = this.uds.getConfigs().avatar;
    
    this.synthesisMessage = '';
    this.messageId = 'synthesisMessage';

    this.questionId = form;

    this.question = '';
    this.docId = '';
    this.pageIndex = 0;
    this.autosave = {};

    this.startTime = Utils.getTimestamp();

    this.wordCount = 0;
    this.charCount = 0;

    this.getQuestion();
    this.autosaveService();
    this.startTime = Utils.getTimestamp();

    this.call('getSynthesisAnswer', this.questionId, (err, res) => {
      if (!err) {
        this.startTime = res.startTime;
        this.answer = res.answer;
        console.log('Answer loaded!', res);
      }
      else {
        this.answer = '';
      }
    });

    $timeout(() => {
      $scope.$watch(() => this.charCount, (newVal, oldVal) => {
        var minWordCount = this.uds.getConfigs().minSynthesisWordLength || 50,
            minCharCount = this.uds.getConfigs().minSynthesisCharLength || 425;

        if (newVal >= minCharCount || this.wordCount >= minWordCount) this.uds.setSession({ readyButton: true });
        else this.uds.setSession({ readyButton: false });
      });
    }, 0);

    this.readyEvent = this.$rootScope.$on('readySynthesis', (event, data) => {
      this.submit();
    });

    this.$onDestroy = () => {
      this.$interval.cancel(this.autosave);
      this.$scope.$on('$destroy', this.readyEvent);
    };

    this.helpers({
      pageList: () => {
        return UserBookmarks.find();
      },
      snippetListPerPage: () => {
        return UserSnippets.find({ docId: this.getReactively('docId') });
      },
      snippetListGlobal2: (docId) => {
        return UserSnippets.find(docId);
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

    this.storeEvent('ChangePageTab', { docId: this.docId, pageIndex: this.pageIndex });
  }

  launchPageModal(snippet) {
    console.log('pageModal', snippet.docId, snippet.snippedText);

    this.storeEvent('OpenPageModal', { docId: snippet.docId, snippet: snippet.snippedText });

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
    var interval = Utils.sec2millis(this.uds.getConfigs().synthesisAutosaveInterval || 30);

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
      }
    }, interval);
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
      this.call('getSynthQuestion', this.questionId, (err, res) => {
        if (!err) {
          this.question = res.question;
          // TODO get latest valid answer
        }
        else {
          console.error('Error while loading question', err);
          this.question = 'No question';
        }
      });
    }
  }

  updateWordCounter() {
    var reducedText = this.answer ? String(this.answer).replace(/<[^>]+>/gm, ' ') : '',  // dgacitua: Delete HTML markup
          wordCount = reducedText.match(/\S+/g).length,           // dgacitua: Count words
          charCount = reducedText.length;                         // dgacitua: Count chars

    this.wordCount = wordCount;
    this.charCount = charCount;
  }

  storeEvent(action, params) {
    this.ets.storeCustomEvent(action, params, (err, res) => {});
  }
}
// create a module
export default angular.module(name, [
  'truncate',
  'ngWig',
  PageModal
])
.component(name, {
  template: template.default,
  controllerAs: name,
  controller: Synthesis
})
.config(ngWigConfig)
.config(config);

function config($stateProvider) {
  'ngInject';

  $stateProvider.state('synthesis', {
    url: '/synthesis',
    template: '<synthesis></synthesis>',
    resolve: {
      userLogged($q) {
        if (!!Meteor.userId()) return $q.resolve();
        else return $q.reject('AUTH_REQUIRED');
      },
      dataReady(userLogged, $q, UserDataService) {
        let uds = UserDataService;
        return uds.ready().then(
          (res) => { return $q.resolve() },
          (err) => { return $q.reject('USERDATA_NOT_READY') }
        );
      },
      stageLock(dataReady, $q, UserDataService) {
        let uds = UserDataService,
           cstn = uds.getSession().currentStageNumber,
           csst = uds.getConfigs().stages[cstn].state,
           cstp = uds.getConfigs().stages[cstn].urlParams,
           stst = 'synthesis';

        if (csst !== stst) return $q.reject('WRONG_STAGE');
        else return $q.resolve();
      },
      userBookmarksSub($promiser, stageLock) {
        return $promiser.subscribe('userBookmarks');
      },
      userSnippetsSub($promiser, stageLock) {
        return $promiser.subscribe('userSnippets');
      }
    }
  })
};

function ngWigConfig(ngWigToolbarProvider) {
  'ngInject';

  ngWigToolbarProvider.addStandardButton('underline', 'Underline', 'underline', 'fa-underline');
};