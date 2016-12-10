import angularTruncate from 'angular-truncate-2';

import { UserBookmarks, UserSnippets } from '../../userCollections';

import template from './stage2.html';

const name = 'stage2';

class Stage2 {
  constructor($scope, $rootScope, $state, $reactive) {
    'ngInject';

    this.$state = $state;
    this.$scope = $scope;
    this.$rootScope = $rootScope;

    $scope.$on('$stateChangeStart', (event) => {
      this.$rootScope.$broadcast('updateSnippetCounter', false);
    });

    $scope.$on('$stateChangeSuccess', (event) => {
      this.$rootScope.$broadcast('updateSnippetCounter', true);
    });

    $reactive(this).attach($scope);

    this.currentDocId = '';

    this.subscribe('userBookmarks', () => {}, {
      onReady: () => {
        this.meteorReady = true;

        //console.log(UserBookmarks, UserBookmarks.find(), UserBookmarks.find().fetch());
        this.pages = UserBookmarks.find().fetch();

        this.url = this.pages[0] ? this.pages[0].url : '/error';
        this.docName = this.url2docName(this.url);
        this.$rootScope.docName = this.docName;
      }
    });

    this.subscribe('userSnippets', () => {}, {
      onReady: () => {
        console.log('SnippetLoad', UserSnippets.find().fetch());
      }
    });


    this.helpers({
      pageList: () => {
        return UserBookmarks.find();
      },
      snippetList: () => {
        return UserSnippets.find();
      }
    });
  }

  url2docName(url) {
    return url.substr(url.lastIndexOf('/') + 1);
  }

  deleteSnippet(index) {
    console.log('Delete Snippet', index);
  }

  changePage(index) {
    this.url = this.pages[index] ? this.pages[index].url : '/error';
    this.docName = this.url2docName(this.url);
    this.$rootScope.docName = this.docName;
    this.$rootScope.$broadcast('changeIframePage', this.$rootScope.docName);
    console.log('ChangePage', index, this.docName, UserSnippets.find().fetch());
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
  controllerAs: name,
  controller: Stage2
})
.component('snippetbar', {
  templateUrl: 'stage2/snippetbar.html',
  controllerAs: name,
  controller: Stage2
})
.config(config);

function config($stateProvider) {
  'ngInject';

// dgacitua: http://stackoverflow.com/a/37964199
  $stateProvider
    .state('stage2', {
      template: '<stage2></stage2>',
      resolve: {
        currentUser($q) {
          if (Meteor.userId() === null) {
            return $q.reject('AUTH_REQUIRED');
          }
          else {
            return $q.resolve();
          }
        }
      }
    })
    .state('stage2.parts', {
      url: '/stage2',
      views: {
        'pageview@stage2': {
          template: '<pageview></pageview>'
        },
        'snippetbar@stage2': {
          template: '<snippetbar></snippetbar>'
        }
      }
    });
};