import { Mongo } from 'meteor/mongo';

export const Bookmarks = new Mongo.Collection('bookmarks');

Bookmarks.allow({
  insert(userId, bm) {
    return userId && bm.userId === userId;
  },
  update(userId, bm, fields, modifier) {
    return userId && bm.userId === userId;
  },
  remove(userId, bm) {
    return userId && bm.userId === userId;
  }
});