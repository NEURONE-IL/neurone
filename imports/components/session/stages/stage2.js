import template from './stage2.html';

class Stage2 {
  constructor() {
    'ngInject';

    this.pages = [
      {
        title: 'asdf',
        content: '1'
      },
      {
        title: 'qwerty',
        content: '2'
      }
    ]
  }

  deleteSnippet(index) {
    console.log('Delete Snippet', index);
  }
}

const name = 'stage2';

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
    })
    /*
    .state('stage2.pageview', {
      url: '/pageview',
      templateUrl: 'stage2/pageview.html',
      controller: Stage2
    })
    .state('stage2.snippetbar', {
      url: '/snippetbar',
      templateUrl: 'stage2/snippetbar.html',
      controller: Stage2
    })
    */
    ;
};