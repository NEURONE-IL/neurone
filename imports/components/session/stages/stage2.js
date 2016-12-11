import angularTruncate from 'angular-truncate-2';

import { UserBookmarks, UserSnippets } from '../../userCollections';
import { UserData } from '../../../api/userData/index';

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
      this.$rootScope.$broadcast('updateSnippetCounter', false);
      this.uds.set({ session: { enableSnippetCounter: false }});
    });

    $scope.$on('$stateChangeSuccess', (event) => {
      this.$rootScope.$broadcast('updateSnippetCounter', true);
      this.uds.set({ session: { enableSnippetCounter: true }});
    });

    $reactive(this).attach($scope);

    /*
    var p1 = $promiser.subscribe('userBookmarks');
    var p2 = $promiser.subscribe('userSnippets');
    var p3 = $promiser.subscribe('userData');
    */
    
    this.currentDocId = '';
    this.userData = {};
    this.pages = [];
    this.snippetCount = 0;

    this.userData = this.uds.get();//UserData.findOne();
    this.pages = UserBookmarks.find().fetch();
    this.changePage(0);
    
    this.meteorReady = true;
    
    this.autorun(() => {
      this.userData = this.uds.get();//UserData.findOne();
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

    this.uds.set({ session: { docId: this.currentDocId }});
    console.log('changePage');

    this.$rootScope.$broadcast('changeIframePage', this.$rootScope.docName);
    this.$rootScope.$broadcast('updateSnippetButton', this.currentDocId);
  }
}

// create a module
export default angular.module(name, [
  'truncate'
])
.component(name, {
  template,
  controllerAs: name,
  controller: Stage2,
  bindings: {
    //userDataSub: '<',
    userBookmarksSub: '<',
    userSnippetsSub: '<'
  }
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
      //component: name,
      resolve: {
        currentUser($q) {
          if (Meteor.userId() === null) {
            return $q.reject('AUTH_REQUIRED');
          }
          else {
            return $q.resolve();
          }
        },
        /*
        userDataSub($promiser) {
          console.log('s2');
          return $promiser.subscribe('userData');
        },
        */
        userBookmarksSub($promiser) {
          return $promiser.subscribe('userBookmarks');
        },
        userSnippetsSub($promiser) {
          return $promiser.subscribe('userSnippets');
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