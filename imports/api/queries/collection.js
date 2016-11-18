import { Mongo } from 'meteor/mongo';

export const Queries = new Mongo.Collection('queries');

Queries.allow({
  insert(userId, qt) {
    return userId && qt.userId === userId;
  },
  update(userId, qt, fields, modifier) {
    return userId && qt.userId === userId;
  },
  remove(userId, qt) {
    return userId && qt.userId === userId;
  }
});