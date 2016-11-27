import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';

import template from './formCtrl.html';

import Utils from '../globalUtils';
import { name as Question } from './modules/question';

class FormCtrl {
  constructor($scope, $reactive, $state, $stateParams) {
    'ngInject';

    this.$scope = $scope;
    this.$state = $state;

    $reactive(this).attach($scope);

    this.form = {};
    this.answers = '';
    this.submitted = false;
    this.submittedError = false;

    Meteor.call('getForm', Utils.parseStringAsInteger($stateParams.id), (err, result) => {
      if (!err) {
        this.form = result;
        this.$scope.$apply();
      }
      else {
        console.error('Unknown Error', err);
      }
    });
  }

  submit() {
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
          this.submitted = true;
        }
        else {
          console.error('Error while saving form answers', err);
          this.submittedError = true;
        }
      });
    }
  }
}

const name = 'formCtrl';

// create a module
export default angular.module(name, [
  angularMeteor,
  uiRouter,
  Question
])
.component(name, {
  template,
  controllerAs: name,
  controller: FormCtrl
})
.config(config);

function config($stateProvider) {
  'ngInject';

  $stateProvider
    .state('form', {
      url: '/form?id',
      template: '<form-ctrl></form-ctrl>',
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