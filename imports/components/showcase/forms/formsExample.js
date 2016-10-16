import angular from 'angular';
import angularMeteor from 'angular-meteor';

import template from './formsExample.html';

import { name as FormTemplates } from '../../forms/formTemplates';

class FormsExample {
  constructor($scope, $reactive) {
    'ngInject';
    
    $reactive(this).attach($scope);

    this.ex1 = {
      title: 'Text Question',
      hint: 'Some hint text'
    };

    this.ex2 = {
      title: 'Paragraph Question',
      hint: 'Another hint text'
    };

    this.answers = '';
  }

  getAnswers() {

  }

  showAnswers() {
    this.answers = this.ex1.title + ': ' + this.ex1.answer + '\n' + this.ex2.title + ': ' +  this.ex2.answer;
  }
};

const name = 'formsExample';

// create a module
export default angular.module(name, [
  angularMeteor,
  FormTemplates
])
.component(name, {
  template,
  controllerAs: name,
  controller: FormsExample
})
.config(config);

function config($stateProvider) {
  'ngInject';

  $stateProvider
    .state('formsExample', {
      url: '/formsExample',
      template: '<forms-example></forms-example>',
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