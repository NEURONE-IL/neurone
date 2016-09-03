import { Meteor } from 'meteor/meteor';

import { Snippets } from '../../imports/api/snippets';

import Utils from './utils';
import LinkTrack from './linktrack';

getSnippet = function() {
	var snippetObject = LinkTrack.saveSnippet();

	if (Meteor.user() && snippetObject != null) {
    snippetObject.owner = Meteor.userId();
    snippetObject.username = Meteor.user().username;
	  Snippets.insert(snippetObject);
	  Utils.logToConsole('Snippet Saved!');
	}
	else {
	  Utils.logToConsole('Error while saving snippet');
	}
};