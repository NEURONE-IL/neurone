import { Meteor } from 'meteor/meteor';
import { FlowComponents } from './collection';

if (Meteor.isServer) {
  Meteor.publish('flowcomponents', function() {
    return FlowComponents.find({});
  });
}