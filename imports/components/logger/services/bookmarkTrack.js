import { Meteor } from 'meteor/meteor';

import Utils from '../loggerUtils';
import LoggerConfigs from '../loggerConfigs';

export default class BookmarkTrackService {
  constructor($state, $translate) {
    'ngInject';

    this.$state = $state;
    this.$translate = $translate;
  }

  isOnDocumentPage() {
    return !!document.getElementById(LoggerConfigs.iframeId);
  }

  isBookmarked(callback) {
    var url = this.$state.href(this.$state.current.name, this.$state.params, {absolute: false});

    Meteor.call('isBookmark', url, (err, result) => {
      if(!err) {
        callback(null, result);
      }
      else {
        console.log('Error getting current page as bookmark!');
        callback(err);
      }
    });
  }

  saveBookmark(callback) {
    if (Meteor.user()) {
      var bookmarkObject = {
        owner: Meteor.userId(),
        username: Meteor.user().emails[0].address,
        title: document.title,
        url: this.$state.href(this.$state.current.name, this.$state.params, {absolute: false}),
        local_time: Utils.getTimestamp()
      };

      Meteor.call('storeBookmark', bookmarkObject, (err, result) => {
        if (!err) {
          var msg = this.$translate.instant('alerts.bookmarkSaved');
          Utils.logToConsole('Bookmark Saved!', bookmarkObject.title, bookmarkObject.url, bookmarkObject.local_time);
          callback(null, msg);
        }
        else {
          var msg = this.$translate.instant('alerts.error');
          console.log('Error saving bookmark!');
          callback(msg);
        }
      });
    }
  }

  removeBookmark(callback) {
    if (Meteor.user()) {
      var userId = Meteor.userId(),
             url = this.$state.href(this.$state.current.name, this.$state.params, {absolute: false});

      Meteor.call('removeBookmark', userId, url, (err, result) => {
        if (!err) {
          var msg = this.$translate.instant('alerts.bookmarkRemoved');
          Utils.logToConsole('Bookmark Removed!');
          callback(null, msg);
        }
        else {
          var msg = this.$translate.instant('alerts.error');
          console.log('Error removing bookmark!');
          callback(msg);
        }
      });
    }
  }
}