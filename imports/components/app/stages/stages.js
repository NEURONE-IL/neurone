import { name as TaskQuestions } from './templates/taskQuestions';
import { name as Instructions } from './templates/instructions';
import { name as Tutorial } from './templates/tutorial';
import { name as Stage0 } from './templates/stage0';
import { name as Search } from './templates/search';
import { name as Collection } from './templates/collection';
import { name as CriticalEval } from './templates/criticalEval';
import { name as Synthesis } from './templates/synthesis';
import { name as Affective } from './templates/affective';
import { name as DisplayPage } from './views/displayPage';

class Stages {}

const name = 'stages';

// create a module
export default angular.module(name, [
  DisplayPage,
  Affective,
  TaskQuestions,
  Instructions,
  Tutorial,
  Search,
  Collection,
  CriticalEval,
  Synthesis
])
.component(name, {
  controllerAs: name,
  controller: Stages
});