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

      Meteor.call('storeBookmark', bookmarkObject, (err, result) => {
        if (!err) {
          var msg = this.$translate.instant('alerts.bookmarkSaved');
          Utils.logToConsole('Bookmark Saved!', bookmarkObject.title, bookmarkObject.url, bookmarkObject.localTimestamp);
          callback(null, msg);
        }
        else {
          var msg = this.$translate.instant('alerts.error');
          console.error('Error saving bookmark!');
          callback(msg);
        }
      });
    }
    else {
      var msg = this.$translate.instant('alerts.error');
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