import { Mongo } from 'meteor/mongo';

export const MouseCoordinates = new Mongo.Collection('mousecoordinates');

MouseCoordinates.allow({
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