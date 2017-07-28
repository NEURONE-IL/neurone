import { Mongo } from 'meteor/mongo';

export const FormQuestions = new Mongo.Collection('formquestions');

FormQuestions.allow({
  insert(userId, fqs) {
    return userId;
  },
  update(userId, fqs, fields, modifier) {
    return userId;
  },
  remove(userId, fqs) {
    return userId;
  }
});
