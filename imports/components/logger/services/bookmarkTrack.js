import { Meteor } from 'meteor/meteor';

import Utils from '../../../lib/utils';
import LoggerConfigs from '../loggerConfigs';

const name = 'bookmarkTrackService';

export default class BookmarkTrackService {
  constructor($translate) {
    'ngInject';

    this.$translate = $translate;
  }

  isOnDocumentPage() {
    return !!document.getElementById(LoggerConfigs.iframeId);
  }

  saveBookmark() {
    if (Meteor.user()) {
      var bookmarkObject = {
        owner: Meteor.userId(),
        username: Meteor.user().emails[0].address,
        title: document.title,
        url: window.location.href,
        local_time: Utils.getTimestamp()
      };

      Meteor.call('storeBookmark', bookmarkObject, (err, result) => {
        if (!err) {
          var msg = this.$translate.instant('alerts.bookmarkSaved');
          Utils.logToConsole(msg);
          return msg;
        }
        else {
          var msg = this.$translate.instant('alerts.error');
          Utils.logToConsole(msg);
          return msg;
        }
      });
    }
  }
}