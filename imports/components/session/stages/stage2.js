import angularTruncate from 'angular-truncate-2';

import Utils from '../../globalUtils';

import { UserBookmarks, UserSnippets } from '../../userCollections';

import template from './stage2.html';

const name = 'stage2';

class Stage2 {
  constructor($scope, $rootScope, $state, $reactive, $q, $promiser, SnippetTrackService, UserDataService) {
    'ngInject';

    this.$state = $state;
    this.$scope = $scope;
    this.$rootScope = $rootScope;

    this.uds = UserDataService;
    this.sts = SnippetTrackService;

    $scope.$on('$stateChangeStart', (event) => {
      //this.$rootScope.$broadcast('updateSnippetCounter', false);
      this.uds.setSession({ snippetCounter: false });
      this.uds.setSession({ stageHome: '/home' });
      this.uds.setSession({ snippetButton: false });
      this.uds.setSession({ readyButton: false });
      this.uds.setSession({ statusMessage: '' });
      this.sts.bindWordCounter();
    });

    $scope.$on('$stateChangeSuccess', (event) => {
      //this.$rootScope.$broadcast('updateSnippetCounter', true);
      this.uds.setSession({ snippetCounter: true });
      this.uds.setSession({ stageHome: '/stage2' });
      this.uds.setSession({ stageNumber: 2 });
      this.sts.unbindWordCounter();

      this.$rootScope.$broadcast('updateNavigation');
    });
  }
}

class Stage2pv {
  constructor($scope, $rootScope, $state, $reactive, $q, $promiser, SnippetTrackService, UserDataService) {
    'ngInject';

    this.meteorReady = true;
  }
}

class Stage2sb {
  constructor($scope, $rootScope, $state, $reactive, $q, $promiser, SnippetTrackService, UserDataService) {
    'ngInject';

    this.$state = $state;
    this.$scope = $scope;
    this.$rootScope = $rootScope;

    this.uds = UserDataService;
    this.sts = SnippetTrackService;

    $rootScope.$on('readyStage2', (event, data) => {
      this.sendForms();
    });

    $reactive(this).attach($scope);

    this.currentDocId = '';
    this.userData = {};
    this.pages = [];
    this.forms = [];
    this.snippetCount = 0;

    this.userData = this.uds.get();
    this.pages = UserBookmarks.find().fetch();
    this.changePage(0);
    this.loadForms();
    this.meteorReady = true;

    this.autorun(() => {
      this.userData = this.uds.get();
      this.pages = UserBookmarks.find().fetch();
      this.currentDocId = this.userData.session.docId;
      this.snippetCount = UserSnippets.find({ docId: this.currentDocId }).count();
      //console.log('Stage2 AUTORUN!', this.userData, this.currentDocId, this.snippetCount);
    });

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
    this.pages.forEach((page, idx) => {
      this.call('getForm', 'stage2', (err, res) => {
        if (!err) {
          var pageForm = {
            index: idx,
            docId: page.docId,
            questions: res.questions
          };

          this.forms.push(pageForm);
        }
        else {
          console.error('Error while loading Stage2 forms', err);
        }
      });
    });

    console.log('Forms Ready!', this.forms);
  }

  sendForms() {
    if (!!Meteor.userId()) {
      var answerArray = [];

      this.forms.forEach((pageForm) => {
        console.log(pageForm);
        pageForm.questions.forEach((question) => {
          var response = {
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

      var response = {
        userId: Meteor.userId(),
        username: Meteor.user().username || Meteor.user().emails[0].address,
        action: 'FormResponse',
        reason: 'ReadyStage2',
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

  changePage(index) {
    this.url = this.pages[index] ? this.pages[index].url : '/error';
    this.$rootScope.docName = this.url2docName(this.url);
    this.$rootScope.docId = this.pages[index] ? this.pages[index].docId : '';
    this.currentDocId = this.$rootScope.docId;

    this.uds.setSession({ docId: this.currentDocId });
    console.log('ChangePage', this.url, this.currentDocId, this.$rootScope.docName, this.$rootScope.docId);

    this.$rootScope.$broadcast('changeIframePage', this.currentDocId);
    this.$rootScope.$broadcast('updateNavigation');
  }
}

// create a module
export default angular.module(name, [
  'truncate'
])
.component(name, {
  template,
  controllerAs: name,
  controller: Stage2
})
.component('pageview', {
  templateUrl: 'stage2/pageview.html',
  controllerAs: 'pageview',
  controller: Stage2pv
})
.component('snippetbar', {
  templateUrl: 'stage2/snippetbar.html',
  controllerAs: 'snippetbar',
  controller: Stage2sb
})
.config(config);

function config($stateProvider) {
  'ngInject';

  // dgacitua: http://stackoverflow.com/a/37964199
  $stateProvider.state('stage2', {
    url: '/stage2',
    views: {
      '': {
        template: '<stage2></stage2>'
      },
      'pageview@stage2': {
        template: '<pageview></pageview>'
      },
      'snippetbar@stage2': {
        template: '<snippetbar></snippetbar>'
      }
    },
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
  });
};