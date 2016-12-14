import template from './bookmarkModal.html';

const name = 'bookmarkModal';

class BookmarkModal {
  constructor($state, $rootScope, KMTrackIframeService, ActionBlockerIframeService) {
    'ngInject';

    this.$rootScope = $rootScope;
    this.kmtis = KMTrackIframeService;
    this.abs = ActionBlockerIframeService;

    this.bookmark = this.resolve.item;
    this.docName = this.url2docName(this.bookmark.url);

    //$state.transitionTo($state.current, {docName: this.docName}, { notify: false });
    this.$rootScope.docId = this.docName;
    //console.log('docName', this.$rootScope.docId);
  }

  url2docName(url) {
    return url.substr(url.lastIndexOf('/') + 1);
  }

  closeModal() {
    delete this.$rootScope.docId;
    //this.iframe.$state.go('/home');
    this.close();
  }
}

export default angular.module(name, [])
.component(name, {
  template,
  controllerAs: name,
  controller: BookmarkModal,
  bindings: {
    resolve: '<',
    close: '&'
  }
});