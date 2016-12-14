import template from './end.html';

const name = 'end';

class End {
  constructor($scope, $reactive) {
    'ngInject';

    $reactive(this).attach($scope);

    this.items = {
      
    }
  }
}

// create a module
export default angular.module(name, [])
.component(name, {
  template,
  controllerAs: name,
  controller: End
})
.config(config);

function config($stateProvider) {
  'ngInject';

  $stateProvider.state('end', {
    url: '/end',
    template: '<end></end>'
  });
};