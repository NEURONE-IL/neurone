import { Mongo } from 'meteor/mongo';

export const UserSettings = new Mongo.Collection('usersettings');

UserSettings.allow({
  insert(userId, us) {
    return userId && us.userId === userId;
  },
  update(userId, us, fields, modifier) {
    return userId && us.userId === userId;
  },
  remove(userId, us) {
    return userId && us.userId === userId;
  }
});
