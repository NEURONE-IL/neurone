import { Meteor } from 'meteor/meteor';

import Utils from '../loggerUtils';
import LoggerConfigs from '../loggerConfigs';

export default class BookmarkTrackService {
  constructor($state, $rootScope, $translate) {
    'ngInject';

    this.$state = $state;
    this.$rootScope = $rootScope;
    this.$translate = $translate;
  }

  isBookmarked(callback) {
    if (!!Meteor.userId()) {
      var url = this.$state.href(this.$state.current.name, this.$state.params, {absolute: false});

      Meteor.call('isBookmark', url, (err, res) => {
        if(!err) {
          callback(null, res);
        }
        else {
          var msg = this.$translate.instant('alerts.bookmarkError');
          console.error('Error getting current page as bookmark!', err);
          callback(msg);
        }
      });
    }
    else {
      var msg = this.$translate.instant('alerts.bookmarkError');
      console.error('Error while detecting current page as bookmark!');
      callback(msg);
    }
  }

  getBookmarks(callback) {
    if (!!Meteor.userId()) {
      var limit = Meteor.user() && Meteor.user().profile.maxBookmarks;

      Meteor.call('getBookmarks', limit, (err, res) => {
        if(!err) {
          callback(null, res);
        }
        else {
          var msg = this.$translate.instant('alerts.bookmarkError');
          console.error('Error while getting bookmarks!', err);
          callback(msg);
        }
      });
    }
    else {
      var msg = this.$translate.instant('alerts.bookmarkError');
      console.error('Error while getting bookmarks!');
      callback(msg);
    }
  }

  makeBookmark(type, callback) {
    if (!!Meteor.userId() && (type === 'Bookmark' || type === 'Unbookmark')) {
      var pageTitle = this.$rootScope.documentTitle,
            pageUrl = this.$state.href(this.$state.current.name, this.$state.params, {absolute: false});

      var bookmarkObject = {
        userId: Meteor.userId(),
        username: Meteor.user().username || Meteor.user().emails[0].address,
        action: type,
        title: (pageTitle ? pageTitle : document.title),
        url: (pageUrl ? pageUrl : window.location.href),
        localTimestamp: Utils.getTimestamp()
      };

      var navbarMsg = (type === 'Bookmark') ? 'alerts.bookmarkSaved' : 'alerts.bookmarkRemoved',
         consoleMsg = (type === 'Bookmark') ? 'Bookmark Saved!' : 'Bookmark Removed!';

      Meteor.call('storeBookmark', bookmarkObject, (err, res) => {
        if (!err) {
          var msg = this.$translate.instant(navbarMsg);
          Utils.logToConsole(consoleMsg, bookmarkObject.title, bookmarkObject.url, bookmarkObject.localTimestamp);
          callback(null, msg);
        }
        else {
          var msg = this.$translate.instant('alerts.bookmarkError');
          console.error('Error saving bookmark!', err);
          callback(msg);
        }
      });
    }
    else {
      var msg = this.$translate.instant('alerts.bookmarkError');
      console.error('Error while saving bookmark!');
      callback(msg);
    }
  }
  
  saveBookmark(callback) {
    this.makeBookmark('Bookmark', (err, res) => {
      if (!err) {
        callback(null, res);
      }
      else {
        callback(err);
      }
    });
  }

  removeBookmark(callback) {
    this.makeBookmark('Unbookmark', (err, res) => {
      if (!err) {
        callback(null, res);
      }
      else {
        callback(err);
      }
    });
  }
}