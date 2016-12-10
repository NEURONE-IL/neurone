import { Meteor } from 'meteor/meteor';

import Utils from '../loggerUtils';
import LoggerConfigs from '../loggerConfigs';

export default class SnippetTrackService {
  constructor($state, $rootScope, $window, $document, $translate) {
    'ngInject';

    this.$state = $state;
    this.$rootScope = $rootScope;
    this.$window = $window;
    this.$document = $document;
    this.$translate = $translate;
  }

  makeSnippet(type, callback) {
    var iframeElement = document.getElementById(LoggerConfigs.iframeId),
         iframeWindow = iframeElement ? iframeElement.contentWindow || iframeElement : null,
              snippet = iframeWindow ? iframeWindow.getSelection().toString() : '',
            wordCount = snippet ? snippet.match(/\S+/g).length : 0;

    console.log('Snippet!', snippet, wordCount);
    this.$rootScope._counters.words = wordCount;

    if (!!Meteor.userId() && !Utils.isEmpty(snippet) && (type === 'Snippet' || type === 'Unsnippet')) {
      var pageTitle = this.$rootScope.documentTitle,
              docId = this.$rootScope.docId,
            pageUrl = this.$state.href(this.$state.current.name, this.$state.params, {absolute: false});
      
      var snippetObject = {
        userId: Meteor.userId(),
        username: Meteor.user().username || Meteor.user().emails[0].address,
        action: type,
        snippedText: snippet,
        title: (pageTitle ? pageTitle : document.title),
        url: (pageUrl ? pageUrl : window.location.href),
        docId: (docId ? docId : ''),
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

  bindWordCounter() {
    // TODO Centralized reference to pageContainer
    var elem = document.getElementById(LoggerConfigs.iframeId);
    /*
    angular.element(elem).ready(() => {
      angular.element(elem).on('mouseup', this.wordCounter);
      console.log('BIND!', 'Snippet', elem);
    });
    */
  }

  unbindWordCounter() {
    /*
    var elem = document.getElementById(LoggerConfigs.iframeId);
    angular.element(elem).ready(() => {
      angular.element(elem).off('mouseup', this.wordCounter);
      console.log('UNBIND!', 'Snippet', elem);
    });
    */
  }

  wordCounter() {
    var iframeElement = document.getElementById(LoggerConfigs.iframeId),
         iframeWindow = iframeElement ? iframeElement.contentWindow || iframeElement.contentDocument.defaultView : null,
              snippet = iframeWindow ? iframeWindow.getSelection().toString() : '';

    if (!Utils.isEmpty(snippet)) {
      var wordCount = snippet.match(/\S+/g).length;
      console.log('wcY', snippet, wordCount);
      this.$rootScope._counters.words = wordCount;
    }
    else {
      console.log('wcN', snippet);
    }
  }
}