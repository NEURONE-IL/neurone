import { Meteor } from 'meteor/meteor';

import './configs';
import Utils from './utils';


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

  saveSnippet() {
    var snippet = window.getSelection().toString();

    if (!Utils.isEmpty(snippet)) {
      var current_url = window.location.href;
      var current_title = document.title;

      var json = {
        title: current_title,
        url: current_url,
        snipped_text: snippet,
        local_time: Utils.getTimestamp()
      };

      if (Meteor.user() && snippetObject != null) {
        snippetObject.owner = Meteor.userId();
        snippetObject.username = Meteor.user().emails[0].address;

        Meteor.call('storeSnippet', snippetObject, function(err, result) {});
        
        Utils.logToConsole('Snippet Saved!');
        alert('Your snippet has been saved!');
      }
      else {
        Utils.logToConsole('Error while saving snippet');
      }
    }
  }
}