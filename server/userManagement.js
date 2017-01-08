import { UserData } from '../imports/api/userData/index';

Accounts.onCreateUser((options, user) => {
  // TODO validate arguments with check()

  user.role = options.role || 'undefined';
  
  var data = {
    userId: user._id,
    username: user.username,
    role: options.role || 'undefined',
    profile: options.profile || {},
    configs: options.configs || {},
    session: options.session || {}
  }

  UserData.insert(data);

  return user;
});

Accounts.validateLoginAttempt((attempt) => {
  if (attempt.methodName === 'resume') {
    return false;
  }
  else {
    return true;
  }
});

Accounts.onLogout((user, connection) => {

});