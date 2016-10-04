import { Meteor } from 'meteor/meteor';

import Utils from '../../../lib/utils';
import LoggerConfigs from '../loggerConfigs';

export default class RelevantPageTrackService {
  constructor() {}

  isOnDocumentPage() {
    return !!document.getElementById(LoggerConfigs.iframeId);
  }

  // TODO save relevant page
  saveRelevantPage() {
    var relevantPageObject = {
      title: document.title,
      url: window.location.href,
      local_time: Utils.getTimestamp()
    };

    if (Meteor.user() && relevantPageObject != null) {
      relevantPageObject.owner = Meteor.userId();
      relevantPageObject.username = Meteor.user().emails[0].address;

      Meteor.call('storeRelevantPage', relevantPageObject, function(err, result) {
        if (!err) {
          Utils.logToConsole('Relevant Page Saved!');
          alert('This page has been marked as relevant!');    
        }
        else {
          Utils.logToConsole('Error while saving relevant page');
        }
      });
    }
  }
}