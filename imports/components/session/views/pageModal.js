import 'mark.js';

import template from './pageModal.html';

const name = 'pageModal';

class PageModal {
  constructor($state, $rootScope, $document, $timeout) {
    'ngInject';

    this.$document = $document;
    this.$rootScope = $rootScope;
    this.$timeout = $timeout;

    this.docId = this.resolve.docId;
    this.snippet = this.resolve.snippet;
    
     this.$rootScope.docId = this.docId;

     this.iframeReady = true;

    //console.log('PageModal', this.docId, this.snippet);
    this.$timeout(() => {
      this.highlightSnippet(this.snippet);
      this.$rootScope.$broadcast('iframeSnippet', { docId: this.docId, snippet: this.snippet });
    }, 0);
  }

  closeModal() {
    delete this.$rootScope.docId;
    this.close();
  }

  highlightSnippet(snippet) {
    var snip = snippet || '';
    
    var searchables = this.$document.find('.highlight').toArray();
    var markInstance = new Mark(searchables);

    markInstance.unmark({ iframes: true }).mark(snip, {
      accurracy: 'exactly',
      iframes: true,
      acrossElements: true,
      separateWordSearch: false,
      className: 'highlightSnippet'
    });
  }
}

export default angular.module(name, [])
.component(name, {
  template,
  controllerAs: name,
  controller: PageModal,
  bindings: {
    resolve: '<',
    close: '&'
  }
});