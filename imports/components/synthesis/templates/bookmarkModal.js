const name = 'bookmarkModal';

class BookmarkModal {
  constructor($scope, close) {
    'ngInject';
  }

  dismissModal(result) {
    close(result, 200); // close, but give 200ms for bootstrap to animate
  }
}

export default angular.module(name, [])
.controller(name, BookmarkModal);
/*
.component(name, {
  controllerAs: name,
  controller: BookmarkModal
});
*/