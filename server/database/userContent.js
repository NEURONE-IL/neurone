import ServerUtils from '../lib/utils';

import { Snippets } from '../../imports/api/snippets/index';
import { Queries } from '../../imports/api/queries/index';
import { Bookmarks } from '../../imports/api/bookmarks/index';

Meteor.methods({
  getSnippets: function() {
    return Snippets.find({ owner: this.userId }).fetch();
  },
  getBookmarks: function() {
    return Bookmarks.find({ owner: this.userId }).fetch();
  },
  storeSnippet: function(jsonObject) {
    check(jsonObject, Object);

    var time = ServerUtils.getTimestamp();
    jsonObject.serverTimestamp = time;

    Snippets.insert(jsonObject);
    //console.log('Snippet Stored!', time);
    return true;
  },
  storeQuery: function(jsonObject) {
    check(jsonObject, Object);

    var time = ServerUtils.getTimestamp(),
       query = jsonObject.query;

    jsonObject.serverTimestamp = time;

    Queries.insert(jsonObject);
    //console.log('Query Stored!', query, time);
    return true;
  },
  storeBookmark: function(jsonObject) {
    check(jsonObject, Object);

    var time = ServerUtils.getTimestamp();
    jsonObject.serverTimestamp = time;

    Bookmarks.insert(jsonObject);
    //console.log('Bookmark Stored!', time);
    return true;
  },
  removeBookmark: function(currentUrl) {
    check(currentUrl, String);

    Bookmarks.remove({ owner: this.userId, url: currentUrl });
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