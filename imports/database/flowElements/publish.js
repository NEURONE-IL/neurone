import { Meteor } from 'meteor/meteor';
import { FlowElements } from './collection';

if (Meteor.isServer) {
  Meteor.publish('flowElements', function() {
    return FlowElements.find({});
  });
}