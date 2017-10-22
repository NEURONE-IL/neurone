import { Mongo } from 'meteor/mongo';

export const FlowElements = new Mongo.Collection('flowelements');

FlowElements.allow({
  insert(userId, fe) {
    return userId;
  },
  update(userId, fe, fields, modifier) {
    return userId
  },
  remove(userId, fe) {
    return userId;
  }
});