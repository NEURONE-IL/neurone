import { Meteor } from 'meteor/meteor';
import { UserData } from './collection';

if (Meteor.isServer) {
  // UserData for views
  Meteor.publish('userData', function() {
    const selector = { $and: [
      { userId: this.userId }, { userId: { $exists: true } }
    ]};
    
    return UserData.find(selector);
  });

  // UserData for Navigation
  Meteor.publish('userDataToggle', function(userId) {
    const selector = { $and: [
      { userId: this.userId }, { userId: { $exists: true } }
    ]};
    
    if (userId) return UserData.find(selector);
    else return this.ready();
  });  
}
