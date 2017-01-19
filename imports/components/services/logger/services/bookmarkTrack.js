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
      var limit = Meteor.user() && Meteor.user().configs.maxBookmarks;

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

  makeBookmark(params, callback) {
    if (!!Meteor.userId() && (params.type === 'Bookmark' || params.type === 'Unbookmark')) {
      var pageTitle = this.$rootScope.documentTitle,
              docId = this.$rootScope.docId,
           relevant = this.$rootScope.documentRelevant,
            pageUrl = this.$state.href(this.$state.current.name, this.$state.params, {absolute: false});

      var bookmarkObject = {
        userId: Meteor.userId(),
        username: Meteor.user().username || Meteor.user().emails[0].address,
        action: params.type,
        title: (pageTitle ? pageTitle : document.title),
        url: (pageUrl ? pageUrl : window.location.href),
        docId: (docId ? docId : ''),
        relevant: (relevant ? relevant : false),
        userMade: params.userMade,
        rating: (params.rating ? params.rating : 0),
        reason: (params.reason ? params.reason : ''),
        localTimestamp: Utils.getTimestamp()
      };

      var navbarMsg = (params.type === 'Bookmark') ? 'alerts.bookmarkSaved' : 'alerts.bookmarkRemoved',
         consoleMsg = (params.type === 'Bookmark') ? 'Bookmark Saved!' : 'Bookmark Removed!';


      //console.log('Bookmark', bookmarkObject);

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

  customBookmark(bookmarkObject, params, callback) {
    if (!!Meteor.userId() && (params.type === 'Bookmark' || params.type === 'Unbookmark')) {
      
      delete bookmarkObject._id;
      bookmarkObject.username = Meteor.user().username || Meteor.user().emails[0].address;
      bookmarkObject.action = params.type;
      bookmarkObject.userMade = params.userMade;
      bookmarkObject.localTimestamp = Utils.getTimestamp();
      bookmarkObject.rating = 0;
      bookmarkObject.reason = '';

      var navbarMsg = (params.type === 'Bookmark') ? 'alerts.bookmarkSaved' : 'alerts.bookmarkRemoved',
         consoleMsg = (params.type === 'Bookmark') ? 'Bookmark Saved!' : 'Bookmark Removed!';


      //console.log('CustomBookmark', bookmarkObject);

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
    var params = {
      type: 'Bookmark',
      userMade: true
    }

    this.makeBookmark(params, (err, res) => {
      if (!err) {
        callback(null, res);
      }
      else {
        callback(err);
      }
    });
  }

  removeBookmark(callback) {
    var params = {
      type: 'Unbookmark',
      userMade: true
    }
    
    this.makeBookmark(params, (err, res) => {
      if (!err) {
        callback(null, res);
      }
      else {
        callback(err);
      }
    });
  }

  removeNonRelevantBookmarks(bookmarkArray, callback) {
    var params = {
      type: 'Unbookmark',
      userMade: false
    }

    var proc = 0;
    
    bookmarkArray.forEach((bkm, idx, arr) => {
      //console.log(bkm);
      if (bkm.relevant === false) {
        this.customBookmark(bkm, params, (err, res) => {
          proc++;
          if (err) callback(err);
          if (proc === arr.length) callback(null, true);
        });
      }
    });
  }

  removeAllBookmarks(bookmarkArray, callback) {
    if (bookmarkArray.length > 0) {
      var proc = 0;
      
      bookmarkArray.forEach((bkm, idx, arr) => {
        var params = {
          type: 'Unbookmark',
          userMade: false
        };

        this.customBookmark(bkm, params, (err, res) => {
          proc++;
          if (err) callback(err);
          if (proc === arr.length) callback(null, true);
        });
      })  
    }
    else {
      callback(null, true);
    }  
  }

  replaceWithRelevantBookmarks(bookmarkArray, callback) {
    console.log('Replacing!');

    Meteor.call('getRelevantDocuments', (err, res) => {
      if (!err) {
        var relevantDocs = res;

        this.removeAllBookmarks(bookmarkArray, (err, res) => {
          if (!err) {
            var proc = 0;

            relevantDocs.forEach((doc, idx, arr) => {
              var params = {
                type: 'Bookmark',
                userMade: false
              };

              var bkm = {
                userId: Meteor.userId(),
                username: Meteor.user().username || Meteor.user().emails[0].address,
                action: doc.type,
                title: doc.title,
                url: '/page/' + doc._id,
                docId: doc._id,
                relevant: doc.relevant,
                rating: 0,
                reason: '',
                localTimestamp: Utils.getTimestamp()
              };

              this.customBookmark(bkm, params, (err, res) => {
                proc++;
                if (err) callback(err);
                if (proc === arr.length) callback(null, true);
              });
            });
          }
          else {
            callback(err);
          }
        });
      }
      else {
        var msg = this.$translate.instant('alerts.bookmarkError');
        console.error('Error saving bookmark!', err);
        callback(msg);
      }
    });
  }
}