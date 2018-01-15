import template from './rating.html';

export default RatingQuestion = {
  template: template.default,
  require: {
    ngModel: '='
  },
  bindings: {
    data: '='
  },
  controller: ($scope, $element, $attrs) => {
    this.validateRating = (value) => {
      if (!!value && value > 0) this.ngModel.$isEmpty(value);
      else this.ngModel.$isEmpty(NaN);
    };

    $scope.$watch(() => this.data.answer, (newVal, oldVal) => {
      this.validateRating(newVal);
    });
  }
}