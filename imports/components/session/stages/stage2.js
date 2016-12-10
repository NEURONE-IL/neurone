import angularTruncate from 'angular-truncate-2';

import { UserBookmarks, UserSnippets } from '../../userCollections';

import template from './stage2.html';

const name = 'stage2';

class Stage2 {
  constructor($scope, $rootScope, $state, $reactive, SnippetTrackService) {
    'ngInject';

    this.$state = $state;
    this.$scope = $scope;
    this.$rootScope = $rootScope;

    this.sts = SnippetTrackService;

    $scope.$on('$stateChangeStart', (event) => {
      this.$rootScope.$broadcast('updateSnippetCounter', false);
    });

    $scope.$on('$stateChangeSuccess', (event) => {
      this.$rootScope.$broadcast('updateSnippetCounter', true);
    });

    $reactive(this).attach($scope);

    this.currentDocId = new ReactiveVar('');

    this.subscribe('userBookmarks', () => {}, {
      onReady: () => {
        this.pages = UserBookmarks.find().fetch();

        this.url = this.pages[0] ? this.pages[0].url : '/error';
        this.$rootScope.docName = this.url2docName(this.url);
        this.$rootScope.docId = this.pages[0] ? this.pages[0].docId : '';
        this.currentDocId.set(this.$rootScope.docId);

        this.meteorReady = true;
      }
    });

    this.subscribe('userSnippets', () => {}, {
      onReady: () => {
        //console.log('SnippetLoad', UserSnippets.find().fetch());
        //console.log('SnippetFilter', this.$rootScope.docId, UserSnippets.find({ docId: this.$rootScope.docId }).fetch());
      }
    });


    this.helpers({
      pageList: () => {
        return UserBookmarks.find();
      },
      snippetListPerPage: () => {
        return UserSnippets.find({ docId: this.currentDocId.get() });
      },
      snippetListGlobal: () => {
        return UserSnippets.find();
      }
    });
  }

  url2docName(url) {
    return url.substr(url.lastIndexOf('/') + 1);
  }

  deleteSnippet(index) {
    this.sts.removeSnippet(index, (err, res) => {
      if (!err) {
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
    this.currentDocId.set(this.$rootScope.docId);
    this.$rootScope.$broadcast('changeIframePage', this.$rootScope.docName);
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