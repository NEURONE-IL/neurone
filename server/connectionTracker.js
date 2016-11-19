import Utils from './lib/utils';

import { FlowLogs } from '../imports/api/flowLogs/index';
import { FlowSessions } from '../imports/api/flowSessions/index';

UserStatus.events.on("connectionLogin", function(fields) {
  console.log('User Login!', fields.userId, fields.connectionId, fields.ipAddr, fields.userAgent, fields.loginTime);
});

UserStatus.events.on("connectionIdle", function(fields) {
  console.log('Idle user!', fields.userId, fields.connectionId, fields.lastActivity);
});

UserStatus.events.on("connectionActive", function(fields) {
  console.log('Active user!', fields.userId, fields.connectionId, fields.lastActivity);
});

UserStatus.events.on("connectionLogout", function(fields) {
  console.log('User Logout!', fields.userId, fields.connectionId, fields.lastActivity, fields.logoutTime);
});