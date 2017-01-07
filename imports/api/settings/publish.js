import { Meteor } from 'meteor/meteor';
import { Settings } from './collection';

if (Meteor.isServer) {
  Meteor.publish('settings', function() {
    const selector = { $and: [
      { userId: this.userId }, { userId: { $exists: true } }
    ]};
    
    return Settings.find(selector);
  });
}
