import { name as Stage2 } from './stages/stage2';

class Stages {}

const name = 'stages';

// create a module
export default angular.module(name, [
  Stage2
])
.component(name, {
  controllerAs: name,
  controller: Stages
});