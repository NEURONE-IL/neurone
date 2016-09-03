import { Meteor } from 'meteor/meteor';

import { Documents } from '../imports/api/documents';
import { Snippets } from '../imports/api/snippets';

Meteor.startup(function () {
  docIndex = 'docIndex'

  if (Documents.find().count() === 0) {
    //Documents._dropIndex(docIndex);

    const loadedDocuments = JSON.parse(Assets.getText('reuters100.json'));
 
    loadedDocuments.forEach(function (document) {
      Documents.insert(document);
    });

    Documents._ensureIndex({
        title: 'text',
        body: 'text'
    }, {
        name: 'docIndex'
    });
  }
});