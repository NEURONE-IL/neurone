import { Meteor } from 'meteor/meteor';

import Utils from '../../../lib/utils';

export default class LinkTrackService {
  constructor() {}

  saveVisitedLink(state) {
    var current_url = window.location.href;
    var current_title = document.title;

    var linkObject = {
      title: current_title,
      url: current_url,
      local_time: Utils.getTimestamp()
    };

    if (Meteor.user() && linkObject != null) {
      linkObject.owner = Meteor.userId();
      linkObject.username = Meteor.user().emails[0].address;
      linkObject.state = state;

      Meteor.call('storeVisitedLink', linkObject, function(err, result) {});

      Utils.logToConsole('Page Saved! ' + state);
    }
  }
}