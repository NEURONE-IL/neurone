import template from './snippetModal.html';

const name = 'snippetModal';

class SnippetModal {
  constructor() {
    'ngInject';

    this.snippet = this.resolve.item;
  }

  closeModal() {
    this.close();
  }
}

export default angular.module(name, [])
.component(name, {
  template: template.default,
  controllerAs: name,
  controller: SnippetModal,
  bindings: {
    resolve: '<',
    close: '&'
  }
});