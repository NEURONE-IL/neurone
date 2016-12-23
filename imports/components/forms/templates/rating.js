import template from './rating.html';

export default RatingQuestion = {
  template,
  require: '?ngModel',
  bindings: {
    data: '='
  },
  controller: () => {
    this.$isEmpty = () => {
      if (this.data.answer <= 0) return false;
      else return true;
    }
  }
}