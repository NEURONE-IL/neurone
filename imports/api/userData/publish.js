import { Meteor } from 'meteor/meteor';
import { UserData } from './collection';

if (Meteor.isServer) {
  Meteor.publish('userData', function() {
    const selector = { $and: [
      { userId: this.userId }, { userId: { $exists: true } }
    ]};
    
    return UserData.find(selector);
  });
}
