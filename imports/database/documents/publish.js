import { Meteor } from 'meteor/meteor';
import { Documents } from './collection';

if (Meteor.isServer) {
  Meteor.publish('documents', function() {
    return Documents.find({});
  });

  // dgacitua: MARKED FOR DEPRECATION
  Meteor.publish('documentDetails', function() {
    return Documents.find({});
  });
}

