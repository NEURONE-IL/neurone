import { Mongo } from 'meteor/mongo';

export const FlowComponents = new Mongo.Collection('flowcomponents');

FlowComponents.allow({
  insert(userId, fc) {
    return userId;
  },
  update(userId, fc, fields, modifier) {
    return userId
  },
  remove(userId, fc) {
    return userId;
  }
});