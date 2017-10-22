import Utils from '../../globalUtils';
import Configs from '../../globalConfigs';

import template from './adminHome.html';

class AdminHome {
  constructor($scope, $reactive) {
    'ngInject';

    $reactive(this).attach($scope);

    this.stats = {};
    this.getServerStats();

    console.log('AdminHome loaded!');
  }

  getServerStats() {
    let localTimestamp = Utils.getTimestamp();

    this.call('getServerStats', localTimestamp, (err, res) => {
      if (!err) this.stats = res;
    });
  }
}

const name = 'adminHome';

export default angular.module(name, [
])
.component(name, {
  template: template.default,
  controllerAs: name,
  controller: AdminHome
});