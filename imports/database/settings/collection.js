import { Mongo } from 'meteor/mongo';

export const Settings = new Mongo.Collection('settings');

Settings.allow({
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
