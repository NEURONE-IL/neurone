import angularTruncate from 'angular-truncate-2';

import 'mark.js';

import Utils from '../../../globalUtils';
import Configs from '../../../globalConfigs';

import { UserBookmarks, UserSnippets } from '../../../userCollections';

import template from './collection.html';

const name = 'collection';

class Collection {
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
        stageHome: '/collection'
      }, (err, res) => {
        if (!err) {
          this.sts.bindWordCounter();

          var stageNumber = this.uds.getSession().currentStageNumber,
             currentStage = this.uds.getConfigs().stages[stageNumber];

          this.uds.setSession({ currentStageName: currentStage.id, currentStageState: currentStage.state });
          
          this.$rootScope.$broadcast('updateNavigation');

          console.log('Collection loaded!');
        }
        else {
          console.error('Error while loading Stage!', err);
        }
      });
    });
  }
}

class CollectionPV {
  constructor($scope, $rootScope, $state, $reactive, $document, $q, $promiser, SnippetTrackService, UserDataService) {
    'ngInject';

    this.$scope = $scope;
    this.$document = $document;

    $reactive(this).attach($scope);

    $rootScope.$on('highlightSnippet', (event, data) => {
      var snip = data || '';
      
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

class CollectionSB {
  constructor($scope, $rootScope, $state, $reactive, $q, $promiser, SnippetTrackService, UserDataService) {
    'ngInject';

    this.$state = $state;
    this.$scope = $scope;
    this.$rootScope = $rootScope;

    this.uds = UserDataService;
    this.sts = SnippetTrackService;

    $rootScope.$on('readyCollection', (event, data) => {
      this.sendForms();
    });

    $reactive(this).attach($scope);

    this.currentDocId = '';
    this.pages = [];
    this.forms = [];
    this.snippetCount = 0;

    this.pages = UserBookmarks.find().fetch();
    this.changePage(0);
    //this.loadForms();
    this.meteorReady = true;

    this.autorun(() => {
      this.pages = UserBookmarks.find().fetch();
      this.currentDocId = this.uds.getSession().docId;
      this.snippetCount = UserSnippets.find({ docId: this.currentDocId }).count();
      //console.log('Collection AUTORUN!', this.userData, this.currentDocId, this.snippetCount);
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

  /*
  loadForms() {
    this.pages.forEach((page, idx) => {
      this.call('getForm', 'collection-fi', (err, res) => { // TODO change hardcoded value
        if (!err) {
          var pageForm = {
            index: idx,
            docId: page.docId,
            questions: res.questions
          };

          this.forms.push(pageForm);
        }
        else {
          console.error('Error while loading Collection forms', err);
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
        reason: 'ReadyCollection',
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
  */
  
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
    this.currentDocId = this.pages[index] ? this.pages[index].docId : '';
    this.$rootScope.docId = this.currentDocId;
    //this.$rootScope.docId = this.url2docName(this.url);
    //this.$rootScope.docId = this.pages[index] ? this.pages[index].docId : '';
    //this.currentDocId = this.$rootScope.docId;

    this.uds.setSession({ docId: this.currentDocId });
    Session.set('docId', this.currentDocId);
    console.log('ChangePage', this.url, this.currentDocId);

    this.$rootScope.$broadcast('changeIframePage', this.currentDocId);
    this.$rootScope.$broadcast('updateSnippetButton');
  }
}

export default angular.module(name, [
  'truncate'
])
.component(name, {
  template,
  controllerAs: name,
  controller: Collection
})
.component('collectionPageview', {
  templateUrl: 'collection/pageview.html',
  controllerAs: 'pageview',
  controller: CollectionPV
})
.component('collectionSnippetbar', {
  templateUrl: 'collection/snippetbar.html',
  controllerAs: 'snippetbar',
  controller: CollectionSB
})
.config(config);

function config($stateProvider) {
  'ngInject';

  // dgacitua: http://stackoverflow.com/a/37964199
  $stateProvider.state('collection', {
    url: '/collection',
    views: {
      '@': {
        template: '<collection></collection>'
      },
      'pageview@collection': {
        template: '<collection-pageview></collection-pageview>'
      },
      'snippetbar@collection': {
        template: '<collection-snippetbar></collection-snippetbar>'
      }
    },
    resolve: {
      dataReady(UserDataService) {
        var uds = UserDataService;
        return uds.ready();
      },
      stageLock($q, UserDataService, dataReady) {
        if (Meteor.userId() === null) {
          return $q.reject('AUTH_REQUIRED');
        }
        else {
          var uds = UserDataService,
              dfr = uds.ready();

          dfr.then((res) => {
            var cstn = uds.getSession().currentStageNumber,
                csst = uds.getConfigs().stages[cstn].state,
                cstp = uds.getConfigs().stages[cstn].urlParams,
                stst = 'collection';

            if (csst !== stst) return $q.reject('WRONG_STAGE');
            else return $q.resolve();
          });
        }
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