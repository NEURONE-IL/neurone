export default class AdminModule {
  constructor() {}

  static createAdmin() {
    var username = process.env.NEURONE_ADMIN_USER || 'admin',
           email = process.env.NEURONE_ADMIN_MAIL || 'admin@mydomain.org',
        password = process.env.NEURONE_ADMIN_PASS || 'NeuroneAdmin123';

    console.log('Creating base admin!', username, email);

    Accounts.createUser({
      username: username,
      email: email,
      password: password,
      profile: {}
    });
  }
}