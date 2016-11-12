import { Mongo } from 'meteor/mongo';

export const SynthesisQuestions = new Mongo.Collection('synthesisquestions');

SynthesisQuestions.allow({
  insert(userId, sqs) {
    return userId && sqs.owner === userId;
  },
  update(userId, sqs, fields, modifier) {
    return userId && sqs.owner === userId;
  },
  remove(userId, sqs) {
    return userId && sqs.owner === userId;
  }
});
