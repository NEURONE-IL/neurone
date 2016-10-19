import { Mongo } from 'meteor/mongo';

export const FormQuestions = new Mongo.Collection('formquestions');

FormQuestions.allow({
  insert(userId, fqs) {
    return userId && fqs.owner === userId;
  },
  update(userId, fqs, fields, modifier) {
    return userId && fqs.owner === userId;
  },
  remove(userId, fqs) {
    return userId && fqs.owner === userId;
  }
});
