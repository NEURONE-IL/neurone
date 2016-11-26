import ServerUtils from '../lib/utils';

import { Snippets } from '../../imports/api/snippets/index';
import { Queries } from '../../imports/api/queries/index';
import { Bookmarks } from '../../imports/api/bookmarks/index';

Meteor.methods({
  getSnippets: function() {
    return Snippets.find({ userId: this.userId }).fetch();
  },
  getBookmarks: function() {
    return Bookmarks.find({ userId: this.userId }).fetch();
  },
  removeBookmark: function(currentUrl) {
    check(currentUrl, String);

    Bookmarks.remove({ timer: this.userId, url: currentUrl });
    return true;
  },
  getBookmark: function(currentUrl) {
    check(currentUrl, String);

    return Bookmarks.find({ url: currentUrl }).fetch();
  },
  isBookmark: function(currentUrl) {
    check(currentUrl, String);

    var bkms = Bookmarks.find({ url: currentUrl }).fetch();
    var result = bkms.length > 0

    //console.log('Is bookmark?', currentUrl, result);
    return result;
  }
});