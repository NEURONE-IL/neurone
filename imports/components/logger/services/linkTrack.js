import { Meteor } from 'meteor/meteor';

import Utils from '../loggerUtils';
import LoggerConfigs from '../loggerConfigs';

export default class LinkTrackService {
  constructor($state) {
    'ngInject';

    this.$state = $state;
  }

  saveVisitedLink(linkState) {
    if (Meteor.user()) {
      // http://stackoverflow.com/a/25615010
      var linkObject = {
        owner: Meteor.userId(),
        username: Meteor.user().emails[0].address,
        state: linkState,
        title: document.title,
        url: this.$state.href(this.$state.current.name, this.$state.params, {absolute: false}),
        local_time: Utils.getTimestamp()
      };

      Meteor.call('storeVisitedLink', linkObject, (err, result) => {
        if (!err) {
          Utils.logToConsole('Page Saved!', linkObject.state, linkObject.title, linkObject.url, linkObject.local_time);
        }
        else {
          Utils.logToConsole('Unknown Error');
        }
      });
    }
  }
}