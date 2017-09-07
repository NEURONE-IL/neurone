import Utils from '../../globalUtils';
import Configs from '../../globalConfigs';

import template from './documentLoader.html';

class DocumentLoader {
  constructor($scope, $reactive) {
    'ngInject';

    $reactive(this).attach($scope);

    console.log('DocumentLoader loaded!');

    this.doc = {};
    this.route = '';
    this.state = 'wait';
  }

  downloadDocument() {
    this.state = 'load';

    if (this.form.$valid) {
      this.docObj = {
        docName: this.docName,
        title: this.title,
        locale: this.locale,
        relevant: this.relevant || false,
        test: !!this.task ? this.task.split(',').map((kw) => { return kw.trim() }) : [],
        topic: !!this.domain ? this.domain.split(',').map((kw) => { return kw.trim() }) : [],
        keywords: !!this.keywords ? this.keywords.split(',').map((kw) => { return kw.trim() }) : [],
        url: this.url,
        searchSnippet: this.snippet || '',
      };

      console.log(this.docObj);

      this.call('fetchDocument', this.docObj, (err, res) => {
        if (!err) {
          console.log(res);
          this.doc = res;
          this.route = res.route;
          this.state = 'show';  
        }
        else {
          console.error('Error while downloading document', err);
          this.doc = {};
          this.route = '';
          this.state = 'error';    
        }
      });
    }
    else {
      console.error('Invalid document form!');
      this.doc = {};
      this.route = '';
      this.state = 'error';
    }
  }

  previewDocument() {
    // TODO
  }
}

const name = 'documentLoader';

export default angular.module(name, [
])
.component(name, {
  template: template.default,
  controllerAs: name,
  controller: DocumentLoader
});