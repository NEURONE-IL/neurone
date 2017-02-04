import 'mark.js';

import template from './pageModal.html';

const name = 'pageModal';

class PageModal {
  constructor($state, $rootScope, $document, $timeout) {
    'ngInject';

    this.$document = $document;
    this.$rootScope = $rootScope;
    this.$timeout = $timeout;

    this.$timeout(() => {
      this.docId = this.resolve.docId;
      this.snippet = this.resolve.snippet;
      
      this.$rootScope.docId = this.docId;
      this.$rootScope.snippet = this.snippet;
      this.iframeReady = true;

      console.log('PageModal', this.$rootScope.docId, this.$rootScope.snippet);
    
      //this.highlightSnippet(this.snippet);
      //this.$rootScope.$broadcast('iframeSnippet', { docId: this.docId, snippet: this.snippet });
    }, 0);
  }

  closeModal() {
    delete this.$rootScope.docId;
    delete this.$rootScope.snippet;
    this.close();
  }

  highlightSnippet(snippet) {
    var snip = snippet || '';
    
    var searchables = this.$document.find('.highlight').toArray();//document.getElementById('pageContainer').contentDocument;
    var markInstance = new Mark(searchables);

    markInstance.unmark({ iframes: true, done: () => {
        markInstance.mark(snip, {
          accurracy: 'exactly',
          iframes: true,
          acrossElements: true,
          separateWordSearch: false,
          className: 'highlightSnippet'
        });
      } 
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