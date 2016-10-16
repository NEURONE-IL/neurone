import angular from 'angular';
import angularMeteor from 'angular-meteor';

import template from './formsExample.html';

import { name as FormTemplates } from '../../forms/formTemplates';

class FormsExample {
  constructor($scope, $reactive) {
    'ngInject';
    
    $reactive(this).attach($scope);

    this.questions = [
      {
        type: 'text',
        title: 'Text Question',
        hint: 'Some hint text'
      },
      {
        type: 'paragraph',
        title: 'Paragraph Question',
        hint: 'Another hint text'
      },
      {
        type: 'multipleChoice',
        title: 'Choose your side',
        options: [
            'Left',
            'Center',
            'Right'
          ]
      },
      {
        type: 'checkbox',
        title: 'Pick your favourites',
        options: [
            'Italiano',
            'Chacarero',
            'Lomito',
            'Choripán',
            'Churrasco'
          ]
      },
      {
        type: 'list',
        title: 'Choose your destiny',
        options: [
            'Blue pill',
            'Red pill'
          ]
      },
    ];

    this.answers = '';
  }

  getAnswers() {

  }

  showAnswers() {
    this.answers = '';
    this.answerArray = [];

    this.questions.forEach((question) => {
      var response = {
        type: question.type,
        title: question.title,
        hint: question.hint || '',
        answer: question.answer || ''
      };

      this.answerArray.push(response);
      this.answers += question.title + ': ' + (question.answer || '') + '\n';
    });

    console.log(this.answerArray);
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