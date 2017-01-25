import { Mongo } from 'meteor/mongo';

export const TrackerLogs = new Mongo.Collection('trackerlogs');

TrackerLogs.allow({
  insert(userId, tl) {
    return userId && tl.userId === userId;
  },
  update(userId, tl, fields, modifier) {
    return userId && tl.userId === userId;
  },
  remove(userId, tl) {
    return userId && tl.userId === userId;
  }
});
