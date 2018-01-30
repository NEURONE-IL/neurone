//import '../../../utils/register';

import TextQuestion from '../templates/text';
import ParagraphQuestion from '../templates/paragraph';
import MultipleChoiceQuestion from '../templates/multipleChoice';
import CheckboxQuestion from '../templates/checkbox';
import ListQuestion from '../templates/list';
import ScaleQuestion from '../templates/scale';
import DateQuestion from '../templates/date';
import TimeQuestion from '../templates/time';
import RatingQuestion from '../templates/rating';

const name = 'formTemplates';

class QuestionCtrl {
  constructor($scope, $compile, $element, $timeout) {
    'ngInject';

    this.$scope = $scope;
    this.$compile = $compile;
    this.$element = $element;
    this.$timeout = $timeout;

    this.$timeout(() => {
      if (this.data.type === 'scale') this.scaleArray = this.generateScale(this.data.min, this.data.max, this.data.step);

      this.$element.html(this.getTemplate(this.data.type)).show();
      this.$compile(this.$element.contents())(this.$scope);
    }, 0);
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

    if (questionType === 'text') return textQuestionTemplate;
    else if (questionType === 'paragraph') return paragraphQuestionTemplate;
    else if (questionType === 'multipleChoice') return multipleChoiceQuestionTemplate;
    else if (questionType === 'checkbox') return checkboxQuestionTemplate;
    else if (questionType === 'list') return listQuestionTemplate;
    else if (questionType === 'scale') return scaleQuestionTemplate;
    else if (questionType === 'date') return dateQuestionTemplate;
    else if (questionType === 'time') return timeQuestionTemplate;
    else if (questionType === 'rating') return ratingQuestionTemplate;
    else return '';
  }

  generateScale(start, stop, step) {
    if (isNaN(stop) || !stop) stop = start, start = 0;
    if (isNaN(step) || !step) step = 1;
    if ((step > 0 && start >= stop) || (step < 0 && start <= stop)) return [];

    let result = [];
    for (let i = start; step > 0 ? i <= stop : i >= stop; i += step) { result.push(i) }
    return result;
  }
}

const Question = {
  // dgacitua: http://stackoverflow.com/a/30268579
  bindings: {
    data: '='
  },
  controller: QuestionCtrl,
  controllerAs: '$ctrl'
};

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
.component('question', Question);