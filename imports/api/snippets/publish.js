import { Meteor } from 'meteor/meteor';
import { Snippets } from './collection';

if (Meteor.isServer) {
  Meteor.publish('snippets', function() {
    const selector = { $and: [
      { owner: this.userId }, { owner: { $exists: true } }
    ]};
    
    return Snippets.find(selector);
  });
}