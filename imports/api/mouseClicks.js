import { Mongo } from 'meteor/mongo';

export const MouseClicks = new Mongo.Collection('mouseClicks');

MouseClicks.allow({
  insert(userId, mc) {
    return userId && mc.owner === userId;
  },
  update(userId, mc, fields, modifier) {
    return userId && mc.owner === userId;
  },
  remove(userId, mc) {
    return userId && mc.owner === userId;
  }
});