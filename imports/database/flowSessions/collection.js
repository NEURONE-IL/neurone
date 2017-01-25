import { Mongo } from 'meteor/mongo';

export const FlowSessions = new Mongo.Collection('flowsessions');

FlowSessions.allow({
  insert(userId, fs) {
    return userId && fs.userId === userId;
  },
  update(userId, fs, fields, modifier) {
    return userId && fs.userId === userId;
  },
  remove(userId, fs) {
    return userId && fs.userId === userId;
  }
});
