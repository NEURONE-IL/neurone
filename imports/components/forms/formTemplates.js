import TextQuestion from './templates/text';
import ParagraphQuestion from './templates/paragraph';
import MultipleChoiceQuestion from './templates/multipleChoice';
import CheckboxQuestion from './templates/checkbox';
import ListQuestion from './templates/list';
import ScaleQuestion from './templates/scale';
import DateQuestion from './templates/date';
import TimeQuestion from './templates/time';

//import ScaleCtrl from './controllers/scaleCtrl';

const name = 'formTemplates';

function QuestionCtrl() {
  // http://stackoverflow.com/a/8273091
  this.range = (start, stop, step) => {
    if (typeof stop == 'undefined') stop = start, start = 0;
    if (typeof step == 'undefined') step = 1;
    if ((step > 0 && start >= stop) || (step < 0 && start <= stop)) return [];

    var result = [];
    for (var i = start; step > 0 ? i <= stop : i >= stop; i += step) {
      result.push(i);
    }

    return result;
  };

  this.scaleArray = this.range(this.data.min, this.data.max, this.data.step);
}


// From http://onehungrymind.com/angularjs-dynamic-templates/
function questionDirective($compile) {
  'ngInclude';

  var textQuestionTemplate = TextQuestion.template;
  var paragraphQuestionTemplate = ParagraphQuestion.template;
  var multipleChoiceQuestionTemplate = MultipleChoiceQuestion.template;
  var checkboxQuestionTemplate = CheckboxQuestion.template;
  var listQuestionTemplate = ListQuestion.template;
  var scaleQuestionTemplate = ScaleQuestion.template;
  var dateQuestionTemplate = DateQuestion.template;
  var timeQuestionTemplate = TimeQuestion.template;

  var getTemplate = (questionType) => {
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
    }

    return template;
  }

  var linker = (scope, element, attrs, ctrl) => {
    element.html(getTemplate(scope.data.type)).show();
    $compile(element.contents())(scope);
  }

  // From https://toddmotto.com/no-scope-soup-bind-to-controller-angularjs/
  return {
    restrict: 'E',
    controller: QuestionCtrl,
    controllerAs: '$ctrl',
    link: linker,
    scope: {
      data: '='
    },
    bindToController: {
      data: '='
    }
  }
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
.directive('question', questionDirective);