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
          let stageNumber = this.uds.getSession().currentStageNumber,
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
    
    let stageName = this.uds.getSession().currentStageName,
      stageNumber = this.uds.getSession().currentStageNumber;

    this.form = {};
    this.avatar = this.uds.getConfigs().avatar;
    this.questionnaire = this.uds.getConfigs().stages[stageNumber].questionnaire;
    this.avatarImage = this.uds.getConfigs().stages[stageNumber].avatarImage;

    this.getQuestions(this.questionnaire);

    this.readyEvent = this.$rootScope.$on('readyTaskQuestions', (event, data) => { this.submit() });
    this.$onDestroy = () => { this.$scope.$on('$destroy', this.readyEvent) };

    $timeout(() => {
      this.$scope.$watch(() => this.taskForm.$valid, (newVal, oldVal) => {
        if (newVal) this.uds.setSession({ readyButton: true });
        else this.uds.setSession({ readyButton: false });
      });
    }, 0);
  }

  getQuestions(questionnaireId) {
    this.call('getForm', Utils.parseStringAsInteger(questionnaireId), (err, result) => {
      if (!err) {
        this.form = result;
        console.log("Form loaded!", this.form);
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
      let response = {
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
      let response = {
        userId: Meteor.userId(),
        username: Meteor.user().username || Meteor.user().emails[0].address,
        action: 'FormResponse',
        reason: this.form.formId,
        answer: this.answerArray,
        localTimestamp: Utils.getTimestamp()
      }

      this.call('storeFormResponse', response, (err, res) => {
        if (!err) {
          console.log('Answers sent to server!', response);
          this.submitted = true;
        }
        else {
          console.error('Error while sending answers', err);
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
  template: template.default,
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
      dataReady($q, UserDataService) {
        var uds = UserDataService;
        return uds.ready().then((status) => {
          if (status === 'USER_LOGGED') return $q.resolve();
          else return $q.reject('USERDATA_NOT_LOADED');
        });
      },
      stageLock($q, UserDataService, dataReady) {
        if (Meteor.userId() === null) {
          return $q.reject('AUTH_REQUIRED');
        }
        else {
          let uds = UserDataService,
              dfr = uds.ready();

          return dfr.then((res) => {
            let cstn = uds.getSession().currentStageNumber,
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