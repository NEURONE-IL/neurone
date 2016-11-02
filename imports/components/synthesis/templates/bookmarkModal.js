import template from './bookmarkModal.html';

const name = 'bookmarkModal';

class BookmarkModal {
  constructor(KMTrackIframeService, ActionBlockerIframeService) {
    'ngInject';

    this.kmtis = KMTrackIframeService;
    this.abs = ActionBlockerIframeService;

    this.bookmark = this.resolve.item;
    this.test = 'SimoneBiles';

    console.log('Bookmark', this.bookmark);
  }

  closeModal() {
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