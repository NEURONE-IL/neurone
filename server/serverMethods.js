export default Meteor.methods({
  // https://github.com/krishamoud/meteor-ip-test
  getClientAddress: function() {
    return this.connection.clientAddress;
  }
});