import ServerUtils from '../lib/utils';

import { Snippets } from '../../imports/api/snippets/index';
import { Queries } from '../../imports/api/queries/index';
import { Bookmarks } from '../../imports/api/bookmarks/index';

Meteor.methods({
  getSnippets: function(userId) {
    check(userId, String);

    return Snippets.find({ owner: userId }).fetch();
  },
  getBookmarks: function(userId) {
    check(userId, String);

    return Bookmarks.find({ owner: userId }).fetch();
  },
  storeSnippet: function(jsonObject) {
    check(jsonObject, Object);

    var time = ServerUtils.getTimestamp();
    jsonObject.server_time = time;

    Snippets.insert(jsonObject);
    //console.log('Snippet Stored!', time);
    return true;
  },
  storeQuery: function(jsonObject) {
    check(jsonObject, Object);

    var time = ServerUtils.getTimestamp(),
       query = jsonObject.query;

    jsonObject.server_time = time;

    Queries.insert(jsonObject);
    //console.log('Query Stored!', query, time);
    return true;
  },
  storeBookmark: function(jsonObject) {
    check(jsonObject, Object);

    var time = ServerUtils.getTimestamp();
    jsonObject.server_time = time;

    Bookmarks.insert(jsonObject);
    //console.log('Bookmark Stored!', time);
    return true;
  },
  removeBookmark: function(userId, currentUrl) {
    check(userId, String);
    check(currentUrl, String);

    Bookmarks.remove({ owner: userId, url: currentUrl });
    return true;
  },
  getBookmarks: function(currentUrl) {
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