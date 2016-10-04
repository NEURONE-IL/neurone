import angular from 'angular';
import angularMeteor from 'angular-meteor';
import angularTranslate from 'angular-translate';

import template from './i18n.html';

class Internationalization {
  constructor($scope, $reactive, $translate) {
    'ngInject';

    this.$translate = $translate;
    
    $reactive(this).attach($scope);
  }

  changeLanguage(key) {
    console.log('Language Change!', key);
    this.$translate.use(key);
  }
};

const name = 'internationalization';

// create a module
export default angular.module(name, [
  angularMeteor,
  angularTranslate
])
.component(name, {
  template,
  controllerAs: name,
  controller: Internationalization
})
.config(config);

function config($stateProvider) {
  'ngInject';

  $stateProvider
    .state('internationalization', {
      url: '/internationalization',
      template: '<internationalization></internationalization>',
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