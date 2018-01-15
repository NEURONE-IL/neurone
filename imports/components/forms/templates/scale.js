import template from './scale.html';

export default ScaleQuestion = {
  template: template.default,
  bindings: {
    data: '='
  },
  controller: ($scope, $element, $attrs) => {
    /*
    const generateScale = (start, stop, step) => {
      if (isNaN(stop) || !stop) stop = start, start = 0;
      if (isNaN(step) || !step) step = 1;
      if ((step > 0 && start >= stop) || (step < 0 && start <= stop)) return [];
  
      let result = [];
      for (let i = start; step > 0 ? i <= stop : i >= stop; i += step) { result.push(i) }
      return result;
    }

    this.$onInit = () => {
      this.scaleArray = generateScale(this.data.min, this.data.max, this.data.step);
      console.log('ScaleArray', this.scaleArray);
    };
    */
  }
}