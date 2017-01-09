import { Meteor } from 'meteor/meteor';

import Utils from '../loggerUtils';
import LoggerConfigs from '../loggerConfigs';

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
        var iframeElement = document.getElementById(LoggerConfigs.iframeId),
           iframeWindow = iframeElement ? iframeElement.contentWindow || iframeElement : null,
                snippet = iframeWindow ? iframeWindow.getSelection().toString() : '',
              wordCount = snippet ? snippet.match(/\S+/g).length : 0;

        //console.log('Snippet!', snippet, wordCount);
        //this.$rootScope._counters.words = wordCount;
        this.uds.setSession({ wordCount : wordCount });

        if (!Utils.isEmpty(snippet)) {
          var pageTitle = this.$rootScope.documentTitle,
                  docId = this.$rootScope.docId,
                pageUrl = this.$state.href(this.$state.current.name, this.$state.params, {absolute: false});
          
          var truncatedLimit = this.uds.getConfigs().snippetWordTruncateThreshold,
            truncatedSnippet = truncatedLimit ? snippet.split(" ").splice(0, truncatedLimit).join(" ") : snippet;

          var snippetObject = {
            userId: Meteor.userId(),
            username: Meteor.user().username || Meteor.user().emails[0].address,
            action: type,
            snippetId: 0,
            snippedText: truncatedSnippet,
            title: (pageTitle ? pageTitle : document.title),
            url: (pageUrl ? pageUrl : window.location.href),
            docId: (docId ? docId : ''),
            localTimestamp: Utils.getTimestamp()
          };

          Meteor.call('storeSnippet', snippetObject, (err, result) => {
            if (!err) {
              var msg = this.$translate.instant('alerts.snippetSaved');
              Utils.logToConsole('Snippet Saved!', snippetObject.docId, snippetObject.snippedText, snippetObject.localTimestamp);
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
      else if (type === 'Unsnippet') {
        var pageTitle = this.$rootScope.documentTitle,
                docId = this.$rootScope.docId,
              pageUrl = this.$state.href(this.$state.current.name, this.$state.params, {absolute: false});
        
        var snippetObject = {
          userId: Meteor.userId(),
          username: Meteor.user().username || Meteor.user().emails[0].address,
          action: type,
          snippetId: (index ? index : 0),
          snippedText: '',
          title: (pageTitle ? pageTitle : document.title),
          url: (pageUrl ? pageUrl : window.location.href),
          docId: (docId ? docId : ''),
          localTimestamp: Utils.getTimestamp()
        };

        Meteor.call('storeSnippet', snippetObject, (err, result) => {
          if (!err) {
            var msg = this.$translate.instant('alerts.snippetSaved');
            Utils.logToConsole('Snippet Saved!', snippetObject.docId, snippetObject.snippedText, snippetObject.localTimestamp);
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