import ngCookies from 'angular-cookies';

// http://maffrigby.com/maintaining-session-info-in-angularjs-when-you-refresh-the-page/
export default class UserPersistenceService {
  constructor($cookies) {
    'ngInject';

    this.username = '';
    this.authToken = '';
  }

  // TODO Generate Auth Token
  setCookie(token) {
    this.authToken = token;
    $cookies.put("neurone_authToken", token);
  }

  getCookie() {
    this.authToken = $cookies.get("neurone_authToken");
    return this.authToken;
  }

  clearCookie() {
    this.authToken = '';
    $cookies.remove("neurone_authToken");
  }
}