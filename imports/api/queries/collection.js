import { Mongo } from 'meteor/mongo';

export const Queries = new Mongo.Collection('queries');

Queries.allow({
  insert(userId, qt) {
    return userId && qt.owner === userId;
  },
  update(userId, qt, fields, modifier) {
    return userId && qt.owner === userId;
  },
  remove(userId, qt) {
    return userId && qt.owner === userId;
  }
});