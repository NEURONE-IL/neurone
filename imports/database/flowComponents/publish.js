import { Meteor } from 'meteor/meteor';
import { FlowComponents } from './collection';

if (Meteor.isServer) {
  Meteor.publish('flowComponents', function() {
    return FlowComponents.find({});
  });
}