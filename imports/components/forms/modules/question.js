import '../../../lib/register.js';

import TextQuestion from '../templates/text';
import ParagraphQuestion from '../templates/paragraph';
import MultipleChoiceQuestion from '../templates/multipleChoice';
import CheckboxQuestion from '../templates/checkbox';
import ListQuestion from '../templates/list';
import ScaleQuestion from '../templates/scale';
import DateQuestion from '../templates/date';
import TimeQuestion from '../templates/time';
import RatingQuestion from '../templates/rating';

//import ScaleCtrl from './controllers/scaleCtrl';

const name = 'formTemplates';

/*
// http://stackoverflow.com/a/8273091
function range(start, stop, step) {
  if (typeof stop == 'undefined') stop = start, start = 0;
  if (typeof step == 'undefined') step = 1;
  if ((step > 0 && start >= stop) || (step < 0 && start <= stop)) return [];

  var result = [];
  for (var i = start; step > 0 ? i <= stop : i >= stop; i += step) {
    result.push(i);
  }

  return result;
}

function QuestionCtrl($scope) {
  'ngInclude';

  var vm = this;
  if (vm.data.type === 'scale') vm.scaleArray = range(vm.data.min, vm.data.max, vm.data.step);
}


// From http://onehungrymind.com/angularjs-dynamic-templates/
function questionDirective($compile) {
  'ngInclude';

  const textQuestionTemplate = TextQuestion.template;
  const paragraphQuestionTemplate = ParagraphQuestion.template;
  const multipleChoiceQuestionTemplate = MultipleChoiceQuestion.template;
  const checkboxQuestionTemplate = CheckboxQuestion.template;
  const listQuestionTemplate = ListQuestion.template;
  const scaleQuestionTemplate = ScaleQuestion.template;
  const dateQuestionTemplate = DateQuestion.template;
  const timeQuestionTemplate = TimeQuestion.template;
  const ratingQuestionTemplate = RatingQuestion.template;

  function getTemplate(questionType) {
    var template = '';

    switch (questionType) {
      case 'text':
        template = textQuestionTemplate;
        break;
      case 'paragraph':
        template = paragraphQuestionTemplate;
        break;
      case 'multipleChoice':
        template = multipleChoiceQuestionTemplate;
        break;
      case 'checkbox':
        template = checkboxQuestionTemplate;
        break;
      case 'list':
        template = listQuestionTemplate;
        break;
      case 'scale':
        template = scaleQuestionTemplate;
        break;
      case 'date':
        template = dateQuestionTemplate;
        break;
      case 'time':
        template = timeQuestionTemplate;
        break;
      case 'rating':
        template = ratingQuestionTemplate;
        break;
    }

    return template;
  }

  function linker(scope, element, attrs, ctrl) {
    element.html(getTemplate(ctrl.data.type)).show();
    $compile(element.contents())(scope);
  }

  // dgacitua: https://toddmotto.com/no-scope-soup-bind-to-controller-angularjs/
  return {
    restrict: 'E',
    //scope: {},
    controller: QuestionCtrl,
    controllerAs: '$ctrl',
    bindToController: { data: '=' },
    link: linker
  }
};
*/

class QuestionCtrl2 {
  constructor($scope, $compile) {
    'ngInject';

    this.$scope = $scope;
    this.$compile = $compile;

    //if (this.data.type === 'scale') this.scaleArray = this.range(this.data.min, this.data.max, this.data.step);
  }

  range(start, stop, step) {
    if (typeof stop == 'undefined') stop = start, start = 0;
    if (typeof step == 'undefined') step = 1;
    if ((step > 0 && start >= stop) || (step < 0 && start <= stop)) return [];

    var result = [];
    for (var i = start; step > 0 ? i <= stop : i >= stop; i += step) {
      result.push(i);
    }

    return result;
  }
}


class Question2 {
  constructor() {
    'ngInject';

    this.restrict = 'E';
    this.scope = { data: '=' },
    this.controller = QuestionCtrl2;
    this.controllerAs = '$ctrl';
    this.bindToController = true;
  }

  link(scope, element, attrs, ctrl) {
    element.html(this.getTemplate(ctrl.data.type)).show();
    ctrl.$compile(element.contents())(scope);
  }

  getTemplate(questionType) {
    const textQuestionTemplate = TextQuestion.template;
    const paragraphQuestionTemplate = ParagraphQuestion.template;
    const multipleChoiceQuestionTemplate = MultipleChoiceQuestion.template;
    const checkboxQuestionTemplate = CheckboxQuestion.template;
    const listQuestionTemplate = ListQuestion.template;
    const scaleQuestionTemplate = ScaleQuestion.template;
    const dateQuestionTemplate = DateQuestion.template;
    const timeQuestionTemplate = TimeQuestion.template;
    const ratingQuestionTemplate = RatingQuestion.template;

    var template = '';

    switch (questionType) {
      case 'text':
        template = textQuestionTemplate;
        break;
      case 'paragraph':
        template = paragraphQuestionTemplate;
        break;
      case 'multipleChoice':
        template = multipleChoiceQuestionTemplate;
        break;
      case 'checkbox':
        template = checkboxQuestionTemplate;
        break;
      case 'list':
        template = listQuestionTemplate;
        break;
      case 'scale':
        template = scaleQuestionTemplate;
        break;
      case 'date':
        template = dateQuestionTemplate;
        break;
      case 'time':
        template = timeQuestionTemplate;
        break;
      case 'rating':
        template = ratingQuestionTemplate;
        break;
    }

    return template;
  }
}

export default angular.module(name, [])
.component('textQuestion', TextQuestion)
.component('paragraphQuestion', ParagraphQuestion)
.component('multipleChoiceQuestion', MultipleChoiceQuestion)
.component('checkboxQuestion', CheckboxQuestion)
.component('listQuestion', ListQuestion)
.component('scaleQuestion', ScaleQuestion)
.component('dateQuestion', DateQuestion)
.component('timeQuestion', TimeQuestion)
.component('ratingQuestion', RatingQuestion)
.directive('question', () => new Question2());

//register(name).directive('question', Question2);