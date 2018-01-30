import template from './multipleChoice.html';

export default MultipleChoiceQuestion = {
  template: template.default,
  bindings: {
    data: '='
  }
  /*
  controller: () => {
    if(!$ctrl.questionResponse.selectedAnswer){
      ctrl.questionResponse.selectedAnswer=null;
    }
    if(ctrl.questionResponse.other){
      ctrl.isOtherAnswer=true;
    }
  },
  */
}