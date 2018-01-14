import { Meteor } from 'meteor/meteor';

import Utils from '../../../globalUtils';
import LogUtils from '../../../logUtils';
import LoggerConfigs from '../../../globalConfigs';

export default class SnippetTrackService {
  constructor($state, $rootScope, $window, $document, $translate, UserDataService) {
    'ngInject';

    this.$state = $state;
    this.$rootScope = $rootScope;
    this.$window = $window;
    this.$document = $document;
    this.$translate = $translate;

    this.uds = UserDataService;
  }

  makeSnippet(type, index, callback) {
    if (!!Meteor.userId()) {
      if (type === 'Snippet') {
        let iframeElement = document.getElementById(LoggerConfigs.iframeId),
           iframeWindow = iframeElement ? iframeElement.contentWindow || iframeElement : null,
                snippet = iframeWindow ? iframeWindow.getSelection().toString() : '',
              wordCount = snippet ? snippet.match(/\S+/g).length : 0;

        //console.log('Snippet!', snippet, wordCount);
        this.uds.setSession({ wordCount : wordCount });

        if (!Utils.isEmpty(snippet)) {
          let pageTitle = this.$rootScope.documentTitle,
                  docId = this.$rootScope.docId,
                pageUrl = this.$state.href(this.$state.current.name, this.$state.params, {absolute: false});
          
          let truncatedLimit = this.uds.getConfigs().maxSnippetWordLength,
            truncatedSnippet = truncatedLimit ? snippet.split(" ").splice(0, truncatedLimit).join(" ") : snippet;

          let snippetObject = {
            userId: Meteor.userId(),
            username: Meteor.user().username || Meteor.user().emails[0].address || '',
            action: type,
            snippetId: 0,
            snippedText: truncatedSnippet,
            title: (pageTitle ? pageTitle : document.title),
            url: (pageUrl ? pageUrl : window.location.href),
            docId: (docId ? docId : ''),
            localTimestamp: Utils.getTimestamp()
          };

          Meteor.apply('storeSnippet', [ snippetObject ], { noRetry: true }, (err, result) => {
            if (!err) {
              let msg = this.$translate.instant('alerts.snippetSaved');
              LogUtils.logToConsole('Snippet Saved!', snippetObject.docId, snippetObject.snippedText, snippetObject.localTimestamp);
              callback(null, msg);
            }
            else {
              let msg = this.$translate.instant('alerts.error');
              LogUtils.logToConsole('Error!', err);
              callback(msg);
            }
          });
        }
      }
      else if (type === 'Unsnippet') {
        let pageTitle = this.$rootScope.documentTitle,
                docId = this.$rootScope.docId,
              pageUrl = this.$state.href(this.$state.current.name, this.$state.params, {absolute: false});
        
        let snippetObject = {
          userId: Meteor.userId(),
          username: Meteor.user().username || Meteor.user().emails[0].address || '',
          action: type,
          snippetId: (index ? index : 0),
          snippedText: '',
          title: (pageTitle ? pageTitle : document.title),
          url: (pageUrl ? pageUrl : window.location.href),
          docId: (docId ? docId : ''),
          localTimestamp: Utils.getTimestamp()
        };

        Meteor.apply('storeSnippet', [ snippetObject ], { noRetry: true }, (err, result) => {
          if (!err) {
            let msg = this.$translate.instant('alerts.snippetSaved');
            LogUtils.logToConsole('Unsnippet Saved!', snippetObject.docId, snippetObject.snippedText, snippetObject.localTimestamp);
            callback(null, msg);
          }
          else {
            let msg = this.$translate.instant('alerts.error');
            LogUtils.logToConsole('Error!', err);
            callback(msg);
          }
        });
      }
    }
  }

  saveSnippet(callback) {
    this.makeSnippet('Snippet', 0, (err, res) => {
      if (!err) {
        callback(null, res);
      }
      else {
        callback(err);
      }
    });
  }

  removeSnippet(index, callback) {
    this.makeSnippet('Unsnippet', index, (err, res) => {
      if (!err) {
        callback(null, res);
      }
      else {
        callback(err);
      }
    });
  }
}