import { Mongo } from 'meteor/mongo';

export const MouseClicks = new Mongo.Collection('mouseclicks');

MouseClicks.allow({
  insert(userId, mc) {
    return userId && mc.userId === userId;
  },
  update(userId, mc, fields, modifier) {
    return userId && mc.userId === userId;
  },
  remove(userId, mc) {
    return userId && mc.userId === userId;
  }
});