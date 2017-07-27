import { Mongo } from 'meteor/mongo';

export const FlowComponents = new Mongo.Collection('flowcomponents');

FlowComponents.allow({
  insert(userId, fc) {
    return userId && fc.userId === userId;
  },
  update(userId, fc, fields, modifier) {
    return userId && fc.userId === userId;
  },
  remove(userId, fc) {
    return userId && fc.userId === userId;
  }
});
