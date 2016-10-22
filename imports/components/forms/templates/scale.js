import template from './scale.html';

export default ScaleQuestion = {
  bindings: {
    data: '='
  },
  controller: () => {
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
  },
  template
}