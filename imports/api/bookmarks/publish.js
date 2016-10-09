import { Meteor } from 'meteor/meteor';
import { Bookmarks } from './collection';

if (Meteor.isServer) {
  Meteor.publish('bookmarks', function() {
    const selector = { $and: [
      { owner: this.userId }, { owner: { $exists: true } }
    ]};
    
    return Bookmarks.find(selector);
  });
}