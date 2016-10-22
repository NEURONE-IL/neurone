import angular from 'angular';
import angularMeteor from 'angular-meteor';

import template from './formsExample.html';

import Utils from '../../globalUtils';
import { name as FormTemplates } from '../../forms/formTemplates';

class FormsExample {
  constructor($scope, $reactive) {
    'ngInject';
    
    $reactive(this).attach($scope);

    this.form = {
      formId: 1,
        questions: [
        {
          questionId: 1,
          type: 'text',
          title: 'Name an Olympic Athlete',
          hint: 'Remember to search some documents first!',
          required: true
        },
        {
          questionId: 2,
          type: 'paragraph',
          title: 'Name your favourite olympic sport and explain why you like it',
          hint: 'You can write a small paragraph here',
          required: false
        },
        {
          questionId: 3,
          type: 'multipleChoice',
          title: 'Which city was host of 2016 Summer Olympics?',
          required: true,
          other: false,
          options: [
              'Sydney',
              'London',
              'Rio',
              'Tokyo'
            ]
        },
        {
          questionId: 4,
          type: 'checkbox',
          title: 'Pick your favourite sports!',
          required: true,
          other: false,
          options: [
              'Running',
              'Swimming',
              'Gymnastics',
              'Football',
              'Basketball'
            ]
        },
        {
          questionId: 5,
          type: 'list',
          title: 'Pick your favourite gymnast!',
          required: true,
          options: [
              'Nadia Comaneci',
              'Simone Biles',
              'Larisa Latynina',
              'Sawao Kato'
            ]
        },
        {
          questionId: 6,
          type: 'date',
          title: 'Insert your birthdate',
          hint: 'It doesn\'t have to be your real one',
          required: false
        },
        {
          questionId: 7,
          type: 'time',
          title: 'What time is it now?',
          required: false
        },
        {
          questionId: 8,
          type: 'scale',
          title: 'How much do you like the NEURONE Platform?',
          hint: 'Use the scale below! :)',
          required: true,
          min: 1,
          max: 10,
          step: 1,
          minLabel: 'I don\'t like it!',
          maxLabel: 'I like it very much!'
        },
        {
          questionId: 9,
          type: 'scale',
          title: 'How happy are you now?',
          hint: 'Use the scale below! :)',
          required: false,
          min: 0,
          max: 100,
          step: 10,
          minLabel: 'I\'m sad :(',
          maxLabel: 'I\'m happy! :)'
        }
      ]
    };

    this.answers = '';
  }

  getAnswers() {

  }

  showAnswers() {
    this.answers = '';
    this.answerArray = [];

    this.form.questions.forEach((question) => {
      var response = {
        type: question.type,
        questionId: question.questionId,
        title: question.title,
        answer: question.answer || ''
      };

      if (question.otherAnswer) {
        response.otherAnswer = question.otherAnswer;
      }

      this.answerArray.push(response);
      this.answers += question.title + ': ' + (question.answer || '') + '\n';
    });

    if (Meteor.user()) {
      var formAnswer = {
        owner: Meteor.userId(),
        username: Meteor.user().emails[0].address,
        formId: this.form.formId,
        answers: this.answerArray,
        local_time: Utils.getTimestamp()
      }

      Meteor.call('storeFormAnswer', formAnswer, (err, result) => {
        if (!err) {
          console.log('Answer registered!', formAnswer.owner, formAnswer.username, formAnswer.formId, formAnswer.answers, formAnswer.local_time);
        }
        else {
          console.log('Unknown Error');
        }
      });
    }
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