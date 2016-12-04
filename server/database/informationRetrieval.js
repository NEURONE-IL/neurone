import { Meteor } from 'meteor/meteor';

import ServerUtils from '../lib/utils';

import { Snippets } from '../../imports/api/snippets/index';
import { Queries } from '../../imports/api/queries/index';
import { Bookmarks } from '../../imports/api/bookmarks/index';

Meteor.methods({
  getSnippets: function(limit) {
    try {
      var selector = { sort: { serverTimestamp: -1 }};
      if (limit) selector.limit = limit;
      return Snippets.find({ userId: this.userId, action: 'Snippet' }, selector).fetch();
    }
    catch (err) {
      throw new Meteor.Error('DatabaseError', 'Could not read from Database!', err);
    }
  },
  getBookmarks: function(limit) {
    try {
      var selector = { sort: { serverTimestamp: -1 }};
      if (limit) selector.limit = limit;
      return Bookmarks.find({ userId: this.userId, action: 'Bookmark' }, selector).fetch();
    }
    catch (err) {
      throw new Meteor.Error('DatabaseError', 'Could not read from Database!', err);
    }
  },
  /*
  removeBookmark: function(currentUrl) {
    check(currentUrl, String);

    Bookmarks.remove({ userId: this.userId, url: currentUrl });
    return true;
  },
  getBookmark: function(currentUrl) {
    check(currentUrl, String);

    return Bookmarks.find({ userId: this.userId, url: currentUrl }).fetch();
  },
  */
  isBookmark: function(currentUrl) {
    check(currentUrl, String);

    try {
      var bkm = Bookmarks.findOne({ userId: this.userId, url: currentUrl },  { sort: { serverTimestamp: -1 }});

      if (bkm && bkm.action === 'Bookmark') return true;
      else return false;
    }
    catch (err) {
      throw new Meteor.Error('DatabaseError', 'Could not read from Database!', err);
    }
    
    // DEPRECATED
    /*
    check(currentUrl, String);

    var bkms = Bookmarks.find({ userId: this.userId, url: currentUrl }).fetch();
    var result = bkms.length > 0;

    //console.log('Is bookmark?', currentUrl, result);
    return result;
    */
  }
});