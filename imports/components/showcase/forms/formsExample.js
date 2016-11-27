import angular from 'angular';
import angularMeteor from 'angular-meteor';

import template from './formsExample.html';

import Utils from '../../globalUtils';
import { name as Question } from '../../forms/modules/question';

class FormsExample {
  constructor($scope, $reactive) {
    'ngInject';

    this.$scope = $scope;
    
    $reactive(this).attach($scope);

    this.form = {};
    this.answers = '';

    Meteor.call('getForm', 1, (err, result) => {
      if (!err) {
        this.form = result;
        this.$scope.$apply();
      }
      else {
        console.log('Unknown Error', err);
      }
    });
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
        userId: Meteor.userId(),
        username: Meteor.user().username || Meteor.user().emails[0].address,
        formId: this.form.formId,
        answers: this.answerArray,
        localTimestamp: Utils.getTimestamp()
      }

      Meteor.call('storeFormAnswer', formAnswer, (err, result) => {
        if (!err) {
          console.log('Answer registered!', formAnswer.userId, formAnswer.username, formAnswer.formId, formAnswer.answers, formAnswer.localTimestamp);
        }
        else {
          console.log('Unknown Error', err);
        }
      });
    }
  }
};

const name = 'formsExample';

// create a module
export default angular.module(name, [
  angularMeteor,
  Question
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