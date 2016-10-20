// TODO Define Meteor User utils
export default class MeteorUser {
  // dgacitua: Check if User is logged
  static isLogged() {
    return !!Meteor.userId();
  }

  static getUser() {
    return Meteor.user();
  }

  static getUserId() {
    return Meteor.userId();
  }

  static getUsername() {
    // TODO: Assign username
    return Meteor.user().emails[0].address;
  }
}