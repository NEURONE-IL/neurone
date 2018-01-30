import angularTruncate from 'angular-truncate-2';

import 'mark.js';

import Utils from '../../globalUtils';
import Configs from '../../globalConfigs';

import { UserBookmarks, UserSnippets } from '../../userCollections';

import template from './criticalEval.html';

const name = 'criticalEval';

class CriticalEval {
  constructor($scope, $rootScope, $state, $reactive, $q, $promiser, SnippetTrackService, UserDataService) {
    'ngInject';

    this.$state = $state;
    this.$scope = $scope;
    this.$rootScope = $rootScope;

    this.uds = UserDataService;
    this.sts = SnippetTrackService;

    $reactive(this).attach($scope);

    $scope.$on('$stateChangeStart', (event) => {
      Session.set('lockButtons', true);
      
      this.uds.setSession({
        snippetCounter: false,
        snippetButton: false,
        readyButton: false,
        statusMessage: ''
      }, (err, res) => {
        if (!err) {
          this.sts.unbindWordCounter();      
        }
        else {
          console.error('Error while unloading Stage!', err);
        }
      });
    });

    $scope.$on('$stateChangeSuccess', (event) => {
      this.uds.setSession({
        snippetCounter: true,
        stageHome: '/criticalEval'
      }, (err, res) => {
        if (!err) {
          this.sts.bindWordCounter();

          let stageNumber = this.uds.getSession().currentStageNumber,
             currentStage = this.uds.getConfigs().stages[stageNumber];

          this.uds.setSession({ currentStageName: currentStage.id, currentStageState: currentStage.state });
          
          this.$rootScope.$broadcast('updateNavigation');

          console.log('CriticalEval loaded!');
        }
        else {
          console.error('Error while loading Stage!', err);
        }
      });
    });

    this.avatar = this.uds.getConfigs().avatar;
  }
}

class CriticalEvalPV {
  constructor($scope, $rootScope, $state, $reactive, $document, $q, $promiser, SnippetTrackService, UserDataService) {
    'ngInject';

    this.$scope = $scope;
    this.$document = $document;

    $reactive(this).attach($scope);

    $rootScope.$on('highlightSnippet', (event, data) => {
      let snip = data || '';
      
      this.searchables = document.getElementById('pageContainer').contentDocument;//this.$document.find('.highlight').toArray();
      this.markInstance = new Mark(this.searchables);

      this.markInstance.unmark({ done: () => {
          this.markInstance.mark(snip, {
            accurracy: 'exactly',
            acrossElements: true,
            separateWordSearch: false,
            className: 'highlightSnippet'
          });
        } 
      });
    });

    this.meteorReady = true;
  }
}

class CriticalEvalSB {
  constructor($scope, $rootScope, $state, $reactive, $timeout, $q, $promiser, SnippetTrackService, EventTrackService, UserDataService) {
    'ngInject';

    this.$state = $state;
    this.$scope = $scope;
    this.$rootScope = $rootScope;

    this.uds = UserDataService;
    this.sts = SnippetTrackService;
    this.ets = EventTrackService;

    $reactive(this).attach($scope);

    this.readyEvent = this.$rootScope.$on('readyCriticalEval', (event, data) => {
      this.sendForms();
    });

    this.$onDestroy = () => {
      this.$scope.$on('$destroy', this.readyEvent);
    };

    this.currentDocId = '';
    this.pages = [];
    this.forms = [];
    this.snippetCount = 0;

    this.pages = UserBookmarks.find().fetch();
    this.changePage(0);
    this.loadForms();
    this.meteorReady = true;

    this.autorun(() => {
      this.pages = UserBookmarks.find().fetch();
      this.currentDocId = this.uds.getSession().docId;
      this.snippetCount = UserSnippets.find({ docId: this.currentDocId }).count();
      //console.log('CriticalEval AUTORUN!', this.userData, this.currentDocId, this.snippetCount);
    });

    $timeout(() => {
      $scope.$watch(() => this.evaluationForm.$valid, (newVal, oldVal) => {
        if (newVal) this.uds.setSession({ readyButton: true });
        else this.uds.setSession({ readyButton: false });
      });
    }, 0);

    this.helpers({
      pageList: () => {
        return UserBookmarks.find();
      },
      snippetListPerPage: () => {
        return UserSnippets.find({ docId: this.getReactively('currentDocId') });
      },
      snippetListGlobal: () => {
        return UserSnippets.find();
      }
    });
  }

  loadForms() {
    let stageNumber = this.uds.getSession().currentStageNumber,
       currentStage = this.uds.getConfigs().stages[stageNumber],
               form = currentStage.form;

    this.call('getForm', form, (err, res) => {
      if (!err) {
        this.pages.forEach((page, idx) => {
          let formQuestions = angular.copy(res).questions;

          let pageForm = {
            index: idx,
            docId: page.docId,
            questions: formQuestions
          };

          this.forms.push(pageForm);
        });
      }
      else {
        console.error('Error while loading CriticalEval forms', err);
      }
    });

    console.log('Forms Ready!', this.forms);
  }

  sendForms() {
    if (!!Meteor.userId()) {
      let answerArray = [];

      this.forms.forEach((pageForm) => {
        pageForm.questions.forEach((question) => {
          let response = {
            index: pageForm.index,
            docId: pageForm.docId,
            type: question.type,
            questionId: question.questionId,
            title: question.title,
            answer: question.answer || ''
          };

          if (question.otherAnswer) {
            response.otherAnswer = question.otherAnswer;
          }

          answerArray.push(response);
        });
      });

      let response = {
        userId: Meteor.userId(),
        username: Meteor.user().username || Meteor.user().emails[0].address,
        action: 'FormResponse',
        reason: 'ReadyCriticalEval',
        answer: answerArray,
        localTimestamp: Utils.getTimestamp()
      }

      this.call('storeFormResponse', response, (err, res) => {
        if (!err) {
          console.log('Answers sent to server!', response);
        }
        else {
          console.error('Error while sending answers', err);
        }
      });
    }
  }

  url2docName(url) {
    return url.substr(url.lastIndexOf('/') + 1);
  }

  /*
  viewSnippet(snippet) {
    this.$rootScope.$broadcast('highlightSnippet', snippet);
  }

  deleteSnippet(index) {
    this.sts.removeSnippet(index, (err, res) => {
      if (!err) {
        this.$rootScope.$broadcast('updateSnippetButton', this.currentDocId);
        console.log('Snippet deleted successfully!', index);
      }
      else {
        console.log('Error while deleting snippet', err);
      }
    });
  }
  */

  changePage(index) {
    this.url = this.pages[index] ? this.pages[index].url : '/error';
    this.currentDocId = this.pages[index] ? this.pages[index].docId : '';
    this.$rootScope.docId = this.currentDocId;
    
    this.uds.setSession({ docId: this.currentDocId });
    Session.set('docId', this.currentDocId);
    console.log('ChangePage', this.url, this.currentDocId);

    this.$rootScope.$broadcast('changeIframePage', this.currentDocId);

    this.storeEvent('ChangePageTab', { docId: this.currentDocId, pageIndex: index });
  }

  storeEvent(action, params) {
    this.ets.storeCustomEvent(action, params, (err, res) => {});
  }
}

export default angular.module(name, [
  'truncate'
])
.component(name, {
  template: template.default,
  controllerAs: name,
  controller: CriticalEval
})
.component('criticalEvalPageview', {
  templateUrl: 'criticalEval/pageview.html',
  controllerAs: 'pageview',
  controller: CriticalEvalPV
})
.component('criticalEvalSnippetbar', {
  templateUrl: 'criticalEval/snippetbar.html',
  controllerAs: 'snippetbar',
  controller: CriticalEvalSB
})
.config(config);

function config($stateProvider) {
  'ngInject';

  // dgacitua: http://stackoverflow.com/a/37964199
  $stateProvider.state('criticalEval', {
    url: '/criticalEval',
    views: {
      '@': {
        template: '<critical-eval></critical-eval>'
      },
      'pageview@criticalEval': {
        template: '<critical-eval-pageview></critical-eval-pageview>'
      },
      'snippetbar@criticalEval': {
        template: '<critical-eval-snippetbar></critical-eval-snippetbar>'
      }
    },
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
           stst = 'criticalEval';

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
  });
};