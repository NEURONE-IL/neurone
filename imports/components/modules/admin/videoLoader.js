import template from './videoLoader.html';

import { FlowComponents } from '../../../database/flowComponents/index';


class VideoLoader {
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

    console.log('VideoLoader loaded!');
  }

  downloadVideo() {
    this.state = 'load';

    if (this.form.$valid) {
      this.docObj = this.parseVideoForm();
        this.docObj.type = 'video'

      console.log('Video download request sent!', this.docObj);

      this.apply('fetchMultimedia', [ this.docObj ], { noRetry: true }, (err, res) => {
        if (!err) {
          this.doc = res;
          this.route = res.route;
          this.state = 'show';
        }
        else {
          console.error('Error while downloading video', err);
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

  previewVideo() {
    this.state = 'load';

    if (this.form.$valid) {
      this.docObj = this.parseVideoForm();
      this.source = this.docObj.url.split('=')[1]
      console.log('Video preview request sent!', this.docObj);

      console.log(this.docObj);
      this.doc = this.docObj;
      this.route = this.docObj.route;
      this.state = 'preview';
    }
    else {
      console.error('Invalid form!');
      this.doc = {};
      this.route = '';
      this.state = 'error';
    }
  }

  parseVideoForm() {
    
    let form = {
      docName: this.vidName,
      relevant: this.relevant || false,
      domain: this.domain,
      locale: this.locale,
      task: this.task,
      keywords: !!(this.keywords) && (this.keywords.length > 1) ? this.keywords.split(',').map((kw) => { return kw.trim() }) : [],
      url: this.vidUrl,
    };

    return form;
  }
}

const name = 'videoLoader';

export default angular.module(name, [
])
.component(name, {
  template: template.default,
  controllerAs: name,
  controller: VideoLoader
});
