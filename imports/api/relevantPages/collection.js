import { Mongo } from 'meteor/mongo';

export const RelevantPages = new Mongo.Collection('relevantPages');

RelevantPages.allow({
  insert(userId, rp) {
    return userId && rp.owner === userId;
  },
  update(userId, rp, fields, modifier) {
    return userId && rp.owner === userId;
  },
  remove(userId, rp) {
    return userId && rp.owner === userId;
  }
});