import { Meteor } from 'meteor/meteor';

import './configs.js';
import './linktrack.js';
import './kmtrack.js';

var SearchIndex = require('../../lib/searchIndex.js');

Meteor.methods({
  'getSnippet': function() {
  	var snippetObject = saveSnippet();
  	var time = getTimestamp();

  	if (snippetObject != null) {
  	  Snippets.insert(snippetObject);
  	  logToConsole('Snippet Saved!');
  	}
  	else {
  	  logToConsole('Error while saving snippet');
  	}
  }
});

Meteor.startup(() => {
  //KMTrack.init();
  //SearchIndex.clearIndex();
});