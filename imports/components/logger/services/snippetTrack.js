import { Meteor } from 'meteor/meteor';

import Utils from '../loggerUtils';
import LoggerConfigs from '../loggerConfigs';

export default class SnippetTrackService {
  constructor($state, $rootScope, $translate) {
    'ngInject';

    this.$state = $state;
    this.$rootScope = $rootScope;
    this.$translate = $translate;
  }

  saveSnippet(callback) {
    var iframeElement = document.getElementById(LoggerConfigs.iframeId),
         iframeWindow = iframeElement ? iframeElement.contentWindow || iframeElement : null,
              snippet = iframeWindow ? iframeWindow.getSelection().toString() || window.getSelection().toString() : window.getSelection().toString(),
            pageTitle = this.$rootScope.documentTitle,
              pageUrl = this.$state.href(this.$state.current.name, this.$state.params, {absolute: false});
    
    if (Meteor.user() && !Utils.isEmpty(snippet)) {
      var snippetObject = {
        userId: Meteor.userId(),
        username: Meteor.user().emails[0].address,
        snippedText: snippet,
        title: (pageTitle ? pageTitle : document.title),
        url: (pageUrl ? pageUrl : window.location.href),
        localTimestamp: Utils.getTimestamp()
      };

      Meteor.call('storeSnippet', snippetObject, (err, result) => {
        if (!err) {
          var msg = this.$translate.instant('alerts.snippetSaved');
          Utils.logToConsole('Snippet Saved!', snippetObject.url, snippetObject.snippedText, snippetObject.localTimestamp);
          callback(null, msg);
        }
        else {
          var msg = this.$translate.instant('alerts.error');
          Utils.logToConsole('Unknown Error');
          callback(msg);
        }
      });
    }
  }
}