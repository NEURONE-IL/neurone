import { Mongo } from 'meteor/mongo';

export const EventLogs = new Mongo.Collection('eventlogs');

EventLogs.allow({
  insert(userId, el) {
    return userId && el.userId === userId;
  },
  update(userId, el, fields, modifier) {
    return userId && el.userId === userId;
  },
  remove(userId, el) {
    return userId && el.userId === userId;
  }
});
