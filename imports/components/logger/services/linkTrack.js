import { Meteor } from 'meteor/meteor';

import Utils from '../loggerUtils';
import LoggerConfigs from '../loggerConfigs';

export default class LinkTrackService {
  constructor($state, $rootScope) {
    'ngInject';

    this.$state = $state;
    this.$rootScope = $rootScope;
  }

  saveVisitedLink(linkState) {
    if (Meteor.user()) {
      var pageTitle = this.$rootScope.documentTitle,
            pageUrl = this.$state.href(this.$state.current.name, this.$state.params, {absolute: false});

      // http://stackoverflow.com/a/25615010
      var linkObject = {
        owner: Meteor.userId(),
        username: Meteor.user().emails[0].address,
        state: linkState,
        title: (pageTitle ? pageTitle : document.title),
        url: (pageUrl ? pageUrl : window.location.href),
        localTimestamp: Utils.getTimestamp()
      };

      Meteor.call('storeVisitedLink', linkObject, (err, result) => {
        if (!err) {
          Utils.logToConsole('Page Saved!', linkObject.state, linkObject.title, linkObject.url, linkObject.localTimestamp);
        }
        else {
          Utils.logToConsole('Unknown Error');
        }
      });
    }
  }
}