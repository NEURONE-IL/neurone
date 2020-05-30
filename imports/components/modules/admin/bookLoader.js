import template from './bookLoader.html';

import { FlowComponents } from '../../../database/flowComponents/index';

class BookLoader {
  constructor($scope, $reactive) {
    'ngInject';

    $reactive(this).attach($scope);

    this.subscribe('flowComponents');

    this.helpers({
      locales: () => FlowComponents.find({ type: 'locale' }),
      domains: () => FlowComponents.find({ type: 'domain' }),
      tasks: () => FlowComponents.find({ type: 'task' })
    });

    this.doc = {};
    this.route = '';
    this.state = 'wait';
    this.source = '';

    console.log('BookLoader loaded!');
  }


  downloadBook() {
    this.state = 'load';

    if (this.form.$valid) {
      this.docObj = this.parseBookForm();
        this.docObj.type = 'book'

      console.log('Book download request sent!', this.docObj);

      this.apply('fetchMultimedia', [ this.docObj ], { noRetry: true }, (err, res) => {
        if (!err) {
           console.log(res);
          this.doc = res;
          this.route = res.route;
          this.state = 'show';
        }
        else {
          console.error('Error while downloading book', err);
          this.doc = {};
          this.route = '';
          this.state = 'error';
        }
      });
    }
    else {
      console.error('Invalid form!');
      this.doc = {};
      this.route = '';
      this.state = 'error';
    }
  }

  previewBook() {
    this.state = 'load';

    if (this.form.$valid) {
      this.docObj = this.parseBookForm();
      this.docObj.type = 'book'

      console.log('Book preview request sent!', this.docObj);

      this.apply('previewMultimedia', [ this.docObj ], { noRetry: true }, (err, res) => {
        if (!err) {
          console.log(res);
          this.doc = res;
          this.route = res.route;
          this.state = 'preview';
        }
        else {
          console.error('Error previewing book '+ this.docObj.url, err);
          this.doc = {};
          this.route = '';
          this.state = 'error';
        }
      });
    }
    else {
      console.error('Invalid form!');
      this.doc = {};
      this.route = '';
      this.state = 'error';
    }
  }

  parseBookForm() {
    
    let form = {
      docName: this.bookName,
      title: this.title,
      relevant: this.relevant || false,
      domain: this.domain || 'test',
      task: this.task,
      keywords: !!(this.keywords) && (this.keywords.length > 1) ? this.keywords.split(',').map((kw) => { return kw.trim() }) : [],
      url: this.bookUrl,
    };

    return form;
  }
}

const name = 'bookLoader';

export default angular.module(name, [
])
.component(name, {
  template: template.default,
  controllerAs: name,
  controller: BookLoader
});
