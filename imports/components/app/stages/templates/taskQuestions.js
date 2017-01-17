import Utils from '../../../globalUtils';
import Configs from '../../../globalConfigs';

import template from './taskQuestions.html';

class TaskQuestions {
  constructor($scope, $rootScope, $reactive, $translate, $timeout, UserDataService) {
    'ngInject';

    this.$scope = $scope;
    this.$timeout = $timeout;
    this.$rootScope = $rootScope;

    this.uds = UserDataService;

    $scope.$on('$stateChangeStart', (event) => {
      Session.set('lockButtons', true);
      
      this.uds.setSession({
        readyButton: false,
        statusMessage: ''
      }, (err, res) => {
        if (!err) {
          // dgacitua: Do nothing for now
        }
        else {
          console.error('Error while unloading Stage!', err);
        }
      });
    });

    $scope.$on('$stateChangeSuccess', (event) => {
      this.uds.setSession({
        readyButton: false,
        statusMessage: '',
        stageHome: '#'
      }, (err, res) => {
        if (!err) {
          var stageNumber = this.uds.getSession().currentStageNumber,
             currentStage = this.uds.getConfigs().stages[stageNumber];

          //this.uds.setSession({ currentStageName: currentStage.id, currentStageState: currentStage.state });

          this.$rootScope.$broadcast('updateNavigation');

          console.log('TaskQuestions loaded!');
        }
        else {
          console.error('Error while loading Stage!', err);
        }
      });
    });

    $reactive(this).attach($scope);
    
    var stageName = this.uds.getSession().currentStageName,
      stageNumber = this.uds.getSession().currentStageNumber;

    this.form = {};
    this.questionnaire = this.uds.getConfigs().stages[stageNumber].questionnaire;

     Meteor.call('getForm', Utils.parseStringAsInteger(this.questionnaire), (err, result) => {
      if (!err) {
        this.form = result;
        this.$scope.$apply();
      }
      else {
        console.error('Unknown Error', err);
      }
    });

    this.$rootScope.$on('readyTaskQuestions', (event, data) => {
      this.submit();
    });

    $timeout(() => {
      $scope.$watch(() => this.taskForm.$valid, (newVal, oldVal) => {
        if (newVal) this.uds.setSession({ readyButton: true });
        else this.uds.setSession({ readyButton: false });
      });
    }, 0);
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

    if (!!Meteor.userId()) {
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

const name = 'taskQuestions';

// create a module
export default angular.module(name, [
])
.component(name, {
  template,
  controllerAs: name,
  controller: TaskQuestions
})
.config(config);

function config($stateProvider) {
  'ngInject';

  $stateProvider.state('taskQuestions', {
    url: '/taskQuestions?stage',
    template: '<task-questions></task-questions>',
    resolve: {
      dataReady(UserDataService) {
        var uds = UserDataService;
        return uds.ready();
      },
      stageLock($q, UserDataService, dataReady) {
        if (Meteor.userId() === null) {
          return $q.reject('AUTH_REQUIRED');
        }
        else {
          var uds = UserDataService,
              dfr = uds.ready();

          dfr.then((res) => {
            var cstn = uds.getSession().currentStageNumber,
                csst = uds.getConfigs().stages[cstn].state,
                cstp = uds.getConfigs().stages[cstn].urlParams,
                stst = 'taskQuestions';

            if (csst !== stst) return $q.reject('WRONG_STAGE');
            else return $q.resolve();
          });
        }
      }
    }
  });
};