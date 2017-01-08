import angularTruncate from 'angular-truncate-2';

import 'mark.js';

import Utils from '../../globalUtils';

import { UserBookmarks, UserSnippets } from '../../userCollections';

import template from './stage2.html';
//import templateSB from './stage2sb.html';
//import templatePV from './stage2pv.html';

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
      this.uds.setSession({ snippetCounter: false });
      this.uds.setSession({ snippetButton: false });
      this.uds.setSession({ readyButton: false });
      this.uds.setSession({ statusMessage: '' });
      this.sts.unbindWordCounter();
    });

    $scope.$on('$stateChangeSuccess', (event) => {
      console.log('Stage2 Success');
      //event.preventDefault();
      this.uds.setSession({ snippetCounter: true });
      this.uds.setSession({ stageHome: '/stage2' });
      this.uds.setSession({ statusMessage: '' });
      this.sts.bindWordCounter();  

      var stageNumber = this.uds.getSession().currentStageNumber,
         currentStage = this.uds.getConfigs().stages[stageNumber];

      this.uds.setSession({ currentStageName: currentStage.id });

      this.$rootScope.$broadcast('updateNavigation');
    });

    // dgacitua: snippet bar
    $rootScope.$on('readyStage2', (event, data) => {
      this.sendForms();
    });

    // dgacitua: page view
    $rootScope.$on('highlightSnippet', (event, data) => {
      var snip = data || '';
      
      var searchables = this.$document.find('.highlight').toArray();
      var markInstance = new Mark(searchables);

      markInstance.unmark({ iframes: true }).mark(snip, {
        accurracy: 'exactly',
        iframes: true,
        acrossElements: true,
        separateWordSearch: false,
        className: 'highlightSnippet'
      });
    });

    $reactive(this).attach($scope);

    var q1 = $promiser.subscribe('userSnippets'),
        q2 = $promiser.subscribe('userBookmarks');

    $q.all([q1, q2]).then((res) => {
      this.subReady = true;
    });

    // dgacitua: snippet bar
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

  // dgacitua: snippet bar
  loadForms() {
    this.pages.forEach((page, idx) => {
      this.call('getForm', 'stage2-fi', (err, res) => { // TODO change hardcoded value
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

  changePage(index) {
    this.url = this.pages[index] ? this.pages[index].url : '/error';
    this.$rootScope.docId = this.url2docName(this.url);
    this.$rootScope.docId = this.pages[index] ? this.pages[index].docId : '';
    this.currentDocId = this.$rootScope.docId;

    this.uds.setSession({ docId: this.currentDocId });
    Session.set('docId', this.currentDocId);
    console.log('ChangePage', this.url, this.currentDocId, this.$rootScope.docId, this.$rootScope.docId);

    this.$rootScope.$broadcast('changeIframePage', this.currentDocId);
    this.$rootScope.$broadcast('updateNavigation');
  }
}

export default angular.module(name, [
  'truncate'
])
.component(name, {
  template,
  controllerAs: name,
  controller: Stage2
})
.config(config);

function config($stateProvider) {
  'ngInject';

  $stateProvider.state('stage2', {
    url: '/stage2',
    template: '<stage2></stage2>',
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
      }
      /*
      userBookmarksSub($q) {
        //return $promiser.subscribe('userBookmarks');
        
        var deferred = $q.defer();
        const handle = Meteor.subscribe('userBookmarks', {
          onReady: () => deferred.resolve(handle),
          onStop: deferred.reject
        });

        return deferred.promise;
      },
      userSnippetsSub($q) {
        //return $promiser.subscribe('userSnippets');

        var deferred = $q.defer();
        const handle = Meteor.subscribe('userSnippets', {
          onReady: () => deferred.resolve(handle),
          onStop: deferred.reject
        });

        return deferred.promise;
      }
      */
    }
  });
};

/*
class Stage2pv {
  constructor($scope, $rootScope, $state, $reactive, $document, $q, $promiser, SnippetTrackService, UserDataService) {
    'ngInject';

    this.$scope = $scope;
    this.$document = $document;

    this.meteorReady = true;

    $rootScope.$on('highlightSnippet', (event, data) => {
      var snip = data || '';
      
      var searchables = this.$document.find('.highlight').toArray();
      var markInstance = new Mark(searchables);

      markInstance.unmark({ iframes: true }).mark(snip, {
        accurracy: 'exactly',
        iframes: true,
        acrossElements: true,
        separateWordSearch: false,
        className: 'highlightSnippet'
      });
    });
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
      this.call('getForm', 'stage2-fi', (err, res) => { // TODO change hardcoded value
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

  changePage(index) {
    this.url = this.pages[index] ? this.pages[index].url : '/error';
    this.$rootScope.docId = this.url2docName(this.url);
    this.$rootScope.docId = this.pages[index] ? this.pages[index].docId : '';
    this.currentDocId = this.$rootScope.docId;

    this.uds.setSession({ docId: this.currentDocId });
    Session.set('docId', this.currentDocId);
    console.log('ChangePage', this.url, this.currentDocId, this.$rootScope.docId, this.$rootScope.docId);

    this.$rootScope.$broadcast('changeIframePage', this.currentDocId);
    this.$rootScope.$broadcast('updateNavigation');
  }
}
*/

/*
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
  //templateUrl: 'stage2/pageview.html',
  template: templatePV,
  controllerAs: 'pageview',
  controller: Stage2pv
})
.component('snippetbar', {
  //templateUrl: 'stage2/snippetbar.html',
  template: templateSB,
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
      '@': {
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
      user($auth) {
        return $auth.awaitUser();
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
*/