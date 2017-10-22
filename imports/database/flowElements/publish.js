import { Meteor } from 'meteor/meteor';
import { FlowElements } from './collection';

if (Meteor.isServer) {
  Meteor.publish('flowElements', function() {
    return FlowElements.find({});
  });

  Meteor.publish('flows', function() {
    return FlowElements.find({ type: 'flow' });
  });

  Meteor.publish('stages', function() {
    return FlowElements.find({ type: 'stage' });
  });
}