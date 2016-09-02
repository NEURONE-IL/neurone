import { Mongo } from 'meteor/mongo';

export const Snippets = new Mongo.Collection('snippets');

Snippets.allow({
  insert(userId, snip) {
    return userId && snip.owner === userId;
  },
  update(userId, snip, fields, modifier) {
    return userId && snip.owner === userId;
  },
  remove(userId, snip) {
    return userId && snip.owner === userId;
  }
});