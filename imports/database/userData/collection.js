import { Mongo } from 'meteor/mongo';

export const UserData = new Mongo.Collection('userdata');

UserData.allow({
  insert(userId, ud) {
    return userId && ud.userId === userId;
  },
  update(userId, ud, fields, modifier) {
    return userId && ud.userId === userId;
  },
  remove(userId, ud) {
    return userId && ud.userId === userId;
  }
});
