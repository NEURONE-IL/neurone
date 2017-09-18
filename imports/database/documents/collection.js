import { Mongo } from 'meteor/mongo';

export const Documents = new Mongo.Collection('documents');

Documents.allow({
  insert(userId, doc) {
    return userId;
  },
  update(userId, doc, fields, modifier) {
    return userId;
  },
  remove(userId, doc) {
    return userId;
  }
});