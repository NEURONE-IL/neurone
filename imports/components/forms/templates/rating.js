import template from './rating.html';

export default RatingQuestion = {
  template,
  require: {
    ngModel: '='
  },
  bindings: {
    data: '='
  },
  controller: ($scope, $timeout) => {
    this.validateRating = (value) => {
      if (!!value && value > 0) this.ngModel.$isEmpty(value);
      else this.ngModel.$isEmpty(NaN);
    };

    $scope.$watch(() => this.data.answer, (newVal, oldVal) => {
      this.validateRating(newVal);
    });
  }
}