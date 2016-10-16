import TextQuestion from './templates/text';
import ParagraphQuestion from './templates/paragraph';

const name = 'formTemplates';

// From http://onehungrymind.com/angularjs-dynamic-templates/
function questionDirective($compile) {
  'ngInclude';

  var textQuestionTemplate = TextQuestion.template;
  var paragraphQuestionTemplate = ParagraphQuestion.template;

  var getTemplate = (questionType) => {
    var template = '';

    switch (questionType) {
      case 'text':
        template = textQuestionTemplate;
        break;
      case 'paragraph':
        template = paragraphQuestionTemplate;
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
.directive('question', questionDirective);