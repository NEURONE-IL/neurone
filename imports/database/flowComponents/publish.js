import { Meteor } from 'meteor/meteor';
import { FlowComponents } from './collection';

if (Meteor.isServer) {
  /*
  Meteor.publish('flowcomponents', function() {
    const selector = { $and: [
      { userId: this.userId }, { userId: { $exists: true } }
    ]};
    
    return FlowComponents.find(selector);
  });
  */
}