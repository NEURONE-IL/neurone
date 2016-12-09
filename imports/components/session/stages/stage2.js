import { UserBookmarks } from '../../userCollections';

import template from './stage2.html';

const name = 'stage2';

class Stage2 {
  constructor($scope, $rootScope, $reactive) {
    'ngInject';

    this.$scope = $scope;
    this.$rootScope = $rootScope;

    $reactive(this).attach($scope);

    this.pageList = [];

    this.subscribe('userBookmarks', () => {}, {
      onReady: () => {
        this.meteorReady = true;

        console.log(UserBookmarks, UserBookmarks.find(), UserBookmarks.find().fetch());
        this.pages = UserBookmarks.find().fetch();

        this.url = this.pages[0] ? this.pages[0].url : '/error';
        this.docName = this.url2docName(this.url);
        this.$rootScope.docName = this.docName;
      }
    });

    this.helpers({
      pageList: () => {
        return UserBookmarks.find();
      }
    });
  }

  url2docName(url) {
    return url.substr(url.lastIndexOf('/') + 1);
  }

  deleteSnippet(index) {
    console.log('Delete Snippet', index);
  }
}

// create a module
export default angular.module(name, [
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