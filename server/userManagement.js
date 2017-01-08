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
  // dgacitua: http://stackoverflow.com/a/26382222
  
  //if (attempt.type == 'resume') return false;
  //if (attempt.methodName == 'resume') return false;
  return true;
});