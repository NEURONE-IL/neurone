import { Meteor } from 'meteor/meteor';
import { UserSettings } from './collection';

if (Meteor.isServer) {
  Meteor.publish('usersettings', function() {
    const selector = { $and: [
      { userId: this.userId }, { userId: { $exists: true } }
    ]};
    
    return UserSettings.find(selector);
  });
}
