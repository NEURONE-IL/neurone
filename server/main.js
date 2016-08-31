import { Meteor } from 'meteor/meteor';

import { Documents } from '../imports/api/documents';
import { Snippets } from '../imports/api/snippets';

Meteor.startup(() => {
  if (Documents.find().count() === 0) {
    const documents = [{
      'name': 'Dubstep-Free Zone',
      'description': 'Fast just got faster with Nexus S.'
    }, {
      'name': 'All dubstep all the time',
      'description': 'Get it on!'
    }, {
      'name': 'Savage lounging',
      'description': 'Leisure suit required. And only fiercest manners.'
    }];
 
    documents.forEach((document) => {
      Documents.insert(document)
    });
  }
});