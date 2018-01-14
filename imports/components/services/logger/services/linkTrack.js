import { Meteor } from 'meteor/meteor';

import Utils from '../../../globalUtils';
import LogUtils from '../../../logUtils';
import LoggerConfigs from '../../../globalConfigs';

export default class LinkTrackService {
  constructor($state, $rootScope) {
    'ngInject';

    this.$state = $state;
    this.$rootScope = $rootScope;
  }

  saveVisitedLink(linkState) {
    if (Meteor.user()) {
      let pageTitle = this.$rootScope.documentTitle,
            pageUrl = this.$state.href(this.$state.current.name, this.$state.params, {absolute: false});

      // http://stackoverflow.com/a/25615010
      let linkObject = {
        userId: Meteor.userId(),
        username: Meteor.user().username || Meteor.user().emails[0].address || '',
        state: linkState,
        title: (pageTitle ? pageTitle : document.title),
        url: (pageUrl ? pageUrl : window.location.href),
        localTimestamp: Utils.getTimestamp()
      };

      Meteor.apply('storeVisitedLink', [ linkObject ], { noRetry: true }, (err, result) => {
        if (!err) {
          LogUtils.logToConsole('Page Saved!', linkObject.state, linkObject.userId, linkObject.username, linkObject.title, linkObject.url, linkObject.localTimestamp);
        }
        else {
          LogUtils.logToConsole('Error!', err);
        }
      });
    }
  }

  saveEnterPage() {
    this.saveVisitedLink('PageEnter');
  }

  saveExitPage() {
    this.saveVisitedLink('PageExit');
  }
}