import { Mongo } from 'meteor/mongo';

export const SynthesisAnswers = new Mongo.Collection('synthesisanswers');

SynthesisAnswers.allow({
  insert(userId, san) {
    return userId && san.owner === userId;
  },
  update(userId, san, fields, modifier) {
    return userId && san.owner === userId;
  },
  remove(userId, san) {
    return userId && san.owner === userId;
  }
});
