import { Mongo } from 'meteor/mongo';

export const Keystrokes = new Mongo.Collection('keystrokes');

Keystrokes.allow({
  insert(userId, ks) {
    return userId && ks.owner === userId;
  },
  update(userId, ks, fields, modifier) {
    return userId && ks.owner === userId;
  },
  remove(userId, ks) {
    return userId && ks.owner === userId;
  }
});