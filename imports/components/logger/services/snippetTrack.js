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

  makeSnippet(type, callback) {
    if (!!Meteor.userId() && !Utils.isEmpty(snippet) && (type === 'Snippet' || type === 'Unsnippet')) {
      var iframeElement = document.getElementById(LoggerConfigs.iframeId),
           iframeWindow = iframeElement ? iframeElement.contentWindow || iframeElement : null,
                snippet = iframeWindow ? iframeWindow.getSelection().toString() || window.getSelection().toString() : window.getSelection().toString(),
              pageTitle = this.$rootScope.documentTitle,
                pageUrl = this.$state.href(this.$state.current.name, this.$state.params, {absolute: false});
      
      var snippetObject = {
        userId: Meteor.userId(),
        username: Meteor.user().username || Meteor.user().emails[0].address,
        action: type,
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
          Utils.logToConsole('Error!', err);
          callback(msg);
        }
      });
    }
  }

  saveSnippet(callback) {
    this.makeSnippet('Snippet', (err, res) => {
      if (!err) {
        callback(null, res);
      }
      else {
        callback(err);
      }
    });
  }

  removeSnippet(callback) {
    this.makeSnippet('Unsnippet', (err, res) => {
      if (!err) {
        callback(null, res);
      }
      else {
        callback(err);
      }
    });
  }
}