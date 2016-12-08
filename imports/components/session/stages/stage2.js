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
.config(config);

function config($stateProvider) {
  'ngInject';

  $stateProvider
    .state('stage2', {
      url: '/stage2?page',
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
  });
};