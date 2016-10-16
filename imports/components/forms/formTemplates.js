import TextQuestion from './templates/text';
import ParagraphQuestion from './templates/paragraph';

const name = 'formTemplates';

export default angular.module(name, [])
.component('textQuestion', TextQuestion)
.component('paragraphQuestion', ParagraphQuestion);