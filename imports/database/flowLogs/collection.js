import { Mongo } from 'meteor/mongo';

export const FlowLogs = new Mongo.Collection('flowlogs');

FlowLogs.allow({
  insert(userId, fl) {
    return userId && fl.userId === userId;
  },
  update(userId, fl, fields, modifier) {
    return userId && fl.userId === userId;
  },
  remove(userId, fl) {
    return userId && fl.userId === userId;
  }
});
