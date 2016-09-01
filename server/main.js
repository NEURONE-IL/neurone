import { Meteor } from 'meteor/meteor';

import { SearchIndex } from '../lib/searchIndex.js';

import { Documents } from '../imports/api/documents';
import { Snippets } from '../imports/api/snippets';

Meteor.startup(() => {
  if (Documents.find().count() === 0) {
    const documents = JSON.parse(Assets.getText('reuters100.json'));
 
    documents.forEach((document) => {
      Documents.insert(document)
    });

    //SearchIndex.addToIndex(documents);
  }
});