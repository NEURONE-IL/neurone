import { Meteor } from 'meteor/meteor';

import Utils from '../../../globalUtils';
import LogUtils from '../../../logUtils';
import LoggerConfigs from '../../../globalConfigs';

export default class BookmarkTrackService {
  constructor($state, $rootScope, $translate) {
    'ngInject';

    this.$state = $state;
    this.$rootScope = $rootScope;
    this.$translate = $translate;
  }

  isBookmarked(callback) {
    if (!!Meteor.userId()) {
      let url = this.$state.href(this.$state.current.name, this.$state.params, {absolute: false});

      Meteor.apply('isBookmark', [ url ], { noRetry: true }, (err, res) => {
        if(!err) {
          callback(null, res);
        }
        else {
          let msg = this.$translate.instant('alerts.bookmarkError');
          console.error('Error getting current page as bookmark!', err);
          callback(msg);
        }
      });
    }
    else {
      let msg = this.$translate.instant('alerts.bookmarkError');
      console.error('Error while detecting current page as bookmark!');
      callback(msg);
    }
  }

  getBookmarks(callback) {
    if (!!Meteor.userId()) {
      let limit = Meteor.user() && Meteor.user().configs.maxBookmarks;

      Meteor.apply('getBookmarks', [ limit ], { noRetry: true }, (err, res) => {
        if(!err) {
          callback(null, res);
        }
        else {
          let msg = this.$translate.instant('alerts.bookmarkError');
          console.error('Error while getting bookmarks!', err);
          callback(msg);
        }
      });
    }
    else {
      let msg = this.$translate.instant('alerts.bookmarkError');
      console.error('Error while getting bookmarks!');
      callback(msg);
    }
  }

  makeBookmark(params, callback) {
    if (!!Meteor.userId() && (params.type === 'Bookmark' || params.type === 'Unbookmark')) {
      let pageTitle = this.$rootScope.documentTitle,
              docId = this.$rootScope.docId,
           relevant = this.$rootScope.documentRelevant,
            pageUrl = this.$state.href(this.$state.current.name, this.$state.params, {absolute: false});

      let bookmarkObject = {
        userId: Meteor.userId(),
        username: Meteor.user().username || Meteor.user().emails[0].address || '',
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

      let navbarMsg = (params.type === 'Bookmark') ? 'alerts.bookmarkSaved' : 'alerts.bookmarkRemoved',
         consoleMsg = (params.type === 'Bookmark') ? 'Bookmark Saved!' : 'Bookmark Removed!';

      Meteor.apply('storeBookmark', [ bookmarkObject ], { noRetry: true }, (err, res) => {
        if (!err) {
          let msg = this.$translate.instant(navbarMsg);
          LogUtils.logToConsole(consoleMsg, bookmarkObject.title, bookmarkObject.url, bookmarkObject.localTimestamp);
          callback(null, msg);
        }
        else {
          let msg = this.$translate.instant('alerts.bookmarkError');
          console.error('Error saving bookmark!', err);
          callback(msg);
        }
      });
    }
    else {
      let msg = this.$translate.instant('alerts.bookmarkError');
      console.error('Error while saving bookmark!');
      callback(msg);
    }
  }

  customBookmark(bookmarkObject, params, callback) {
    if (!!Meteor.userId() && (params.type === 'Bookmark' || params.type === 'Unbookmark')) {
      
      delete bookmarkObject._id;
      bookmarkObject.username = Meteor.user().username || Meteor.user().emails[0].address || '';
      bookmarkObject.action = params.type;
      bookmarkObject.userMade = params.userMade;
      bookmarkObject.localTimestamp = Utils.getTimestamp();
      bookmarkObject.rating = 0;
      bookmarkObject.reason = '';

      let navbarMsg = (params.type === 'Bookmark') ? 'alerts.bookmarkSaved' : 'alerts.bookmarkRemoved',
         consoleMsg = (params.type === 'Bookmark') ? 'Bookmark Saved!' : 'Bookmark Removed!';


      //console.log('CustomBookmark', bookmarkObject);

      Meteor.apply('storeBookmark', [ bookmarkObject ], { noRetry: true }, (err, res) => {
        if (!err) {
          let msg = this.$translate.instant(navbarMsg);
          LogUtils.logToConsole(consoleMsg, bookmarkObject.title, bookmarkObject.url, bookmarkObject.localTimestamp);
          callback(null, msg);
        }
        else {
          let msg = this.$translate.instant('alerts.bookmarkError');
          console.error('Error saving bookmark!', err);
          callback(msg);
        }
      });
    }
    else {
      let msg = this.$translate.instant('alerts.bookmarkError');
      console.error('Error while saving bookmark!');
      callback(msg);
    }
  }

  saveBookmark(callback) {
    let params = {
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
    let params = {
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
    let params = {
      type: 'Unbookmark',
      userMade: false
    }

    let proc = 0;
    
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
      let proc = 0;
      
      bookmarkArray.forEach((bkm, idx, arr) => {
        let params = {
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

    Meteor.apply('getRelevantDocuments', [], { noRetry: true }, (err, res) => {
      if (!err) {
        let relevantDocs = res;

        this.removeAllBookmarks(bookmarkArray, (err, res) => {
          if (!err) {
            let proc = 0;

            relevantDocs.forEach((doc, idx, arr) => {
              let params = {
                type: 'Bookmark',
                userMade: false
              };

              let bkm = {
                userId: Meteor.userId(),
                username: Meteor.user().username || Meteor.user().emails[0].address || '',
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
        let msg = this.$translate.instant('alerts.bookmarkError');
        console.error('Error saving bookmark!', err);
        callback(msg);
      }
    });
  }
}