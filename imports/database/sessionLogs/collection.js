import { Mongo } from 'meteor/mongo';

export const SessionLogs = new Mongo.Collection('sessionlogs');

SessionLogs.allow({
  insert(userId, sl) {
    return userId && sl.userId === userId;
  },
  update(userId, sl, fields, modifier) {
    return userId && sl.userId === userId;
  },
  remove(userId, sl) {
    return userId && sl.userId === userId;
  }
});