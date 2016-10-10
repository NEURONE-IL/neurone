import { Meteor } from 'meteor/meteor';

import Utils from '../loggerUtils';
import LoggerConfigs from '../loggerConfigs';

export default class LinkTrackService {
  constructor() {}

  saveVisitedLink(linkState) {
    if (Meteor.user()) {
      var linkObject = {
        owner: Meteor.userId(),
        username: Meteor.user().emails[0].address,
        state: linkState,
        title: document.title,
        url: window.location.href,
        local_time: Utils.getTimestamp()
      };

      Meteor.call('storeVisitedLink', linkObject, (err, result) => {
        if (!err) {
          Utils.logToConsole('Page Saved!', linkObject.state, linkObject.url, linkObject.local_time);
        }
        else {
          Utils.logToConsole('Unknown Error');
        }
      });
    }
  }
}