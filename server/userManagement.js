import { UserData } from '../imports/api/userData/index';

Accounts.onCreateUser((options, user) => {
  // TODO validate arguments with check()

  user.role = options.role || 'undefined';
  
  var data = {
    userId: user._id,
    role: options.role || 'undefined',
    profile: options.profile || {},
    configs: options.configs || {},
    session: options.session || {}
  }

  UserData.insert(data);

  return user;
});