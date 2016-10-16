import TextQuestion from './templates/text';
import ParagraphQuestion from './templates/paragraph';
import MultipleChoiceQuestion from './templates/multipleChoice';
import CheckboxQuestion from './templates/checkbox';
import ListQuestion from './templates/list';

const name = 'formTemplates';

// From http://onehungrymind.com/angularjs-dynamic-templates/
function questionDirective($compile) {
  'ngInclude';

  var textQuestionTemplate = TextQuestion.template;
  var paragraphQuestionTemplate = ParagraphQuestion.template;
  var multipleChoiceQuestionTemplate = MultipleChoiceQuestion.template;
  var checkboxQuestionTemplate = CheckboxQuestion.template;
  var listQuestionTemplate = ListQuestion.template;

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
    }

    return template;
  }

  var linker = (scope, element, attrs) => {
    element.html(getTemplate(scope.data.type)).show();
    $compile(element.contents())(scope);
  }

  // From https://toddmotto.com/no-scope-soup-bind-to-controller-angularjs/
  return {
    restrict: 'E',
    controller: () => {},
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
.directive('question', questionDirective);