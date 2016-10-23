import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';

import ngWig from '../../lib/ngWig/ng-wig';
import '../../lib/ngWig/css/ng-wig.css';
import '../../lib/ngWig/plugins/formats.ngWig';
import '../../lib/ngWig/plugins/forecolor.ngWig';
import '../../lib/ngWig/plugins/clear-styles.ngWig';

import template from './synthesis.html';

class Synthesis {
  constructor($scope, $reactive, $state, $stateParams) {
    'ngInject';

    this.$scope = $scope;
    this.$state = $state;

    $reactive(this).attach($scope);

    this.question = 'Some question';    // TODO Load from database ($stateParams.id)
    this.answer = '';
  }

  submit() {

  }
}

const name = 'synthesis';

// create a module
export default angular.module(name, [
  angularMeteor,
  uiRouter,
  'ngWig'
])
.component(name, {
  template,
  controllerAs: name,
  controller: Synthesis
})
.config(ngWigConfig)
.config(config);

function config($stateProvider) {
  'ngInject';

  $stateProvider
    .state('synthesis', {
      url: '/synthesis?id',
      template: '<synthesis></synthesis>',
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

function ngWigConfig(ngWigToolbarProvider) {
  'ngInject';

  ngWigToolbarProvider.addStandardButton('underline', 'Underline', 'underline', 'fa-underline');
};