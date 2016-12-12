import { name as Stage2 } from './stages/stage2';
import { name as Stage3 } from './stages/stage3';

class Stages {}

const name = 'stages';

// create a module
export default angular.module(name, [
  Stage2,
  Stage3
])
.component(name, {
  controllerAs: name,
  controller: Stages
});