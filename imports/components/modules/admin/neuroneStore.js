import template from './neuroneStore.html';


import { FormQuestions } from '../../../database/formQuestions/index';
import { FormQuestionnaires } from '../../../database/formQuestionnaires/index';
import { SynthesisQuestions } from '../../../database/synthesisQuestions/index';
import { FlowElements } from '../../../database/flowElements/index';
import { FlowComponents } from '../../../database/flowComponents/index';
import { Locales } from '../../../database/assets/locales';
import { Modals } from '../../../database/assets/modals';
import { Templates } from '../../../database/assets/templates';
import { Images } from '../../../database/assets/images';

class NeuroneStore {
    constructor($scope, $reactive, $http) {
      'ngInject';

      this.$http = $http;
  
      $reactive(this).attach($scope);

      this.credentials = {
          username: '',
          password: ''
        };
  
      this.neededElements = 0;
      this.completedElements = 0;
      this.loadingStatus = '';
      this.activeStudy = {};
      this.studies = [];
      this.token = null;
      this.urlStore = process.env.NEURONE_STORE_URL || 'http://localhost:4000/';
    }
    //Llamada al login del Store
    loginStore(){
      var loginUrl = this.urlStore + 'login';
      let data = {
        email: this.email,
        password: this.password
      }
      this.$http.post(loginUrl, data).then((response) => {
          this.token = response.data.token;
          //this.loadPublishes(response.data.token);
          //console.log(this.token);
        }, (error) => {
          console.log(error);
      });
    }
    //Cargado de publicaciones en STORE
    loadPublishes(){
      var publishesUrl = this.urlStore + 'my-publishes';
      this.$http.get(publishesUrl, {headers: {
          'Authorization': `Bearer ${this.token}`
        }}).then((response) => {
          this.studies = response.data.publishes;
          for (const study of this.studies) {
            study.status = '';
          }
          //console.log(this.studies);
        }, (error) => {
          console.log(error);
      });
      return;
    }
    //Funcion que crea un estudio publicado en NEURONE STORE
    //Primero se descargan los assets, luego se crean las preguntas y finalmente las etapas del estudio.
    createStudyStore(study){
      this.activeStudy = study;
      this.activeStudy.status = 'Loading';
      this.activeStudy.study.type = 'flow';
      let stages = this.activeStudy.study.stages;
      let newStudyElement = this.activeStudy.study;

      //Suma de variables a completar
      this.neededElements += this.activeStudy.docs.length;

      this.obtainAssetsPath();
      this.saveQuestions();
      this.saveQuestionnaires();
      this.saveSynthesis();
      this.loadFlowComponents();

      //Adaptacion de los assets para que sean compatibles con neurone
      for (const stage of stages) {
        console.log(stages);
        if(stage.slides){
          for (let i = 0; i < stage.slides.length; i++) {
            stage.slides[i] = `assets/images/${stage.slides[i].split('/')[2]}`;
          }
        }
        if(stage.page){
          stage.page = `assets/templates/${stage.page.split('/')[2]}`;
        }
        if(stage.tips){
          stage.tips = `assets/modals/${stage.tips.split('/')[2]}`;
        }
        if(stage.avatarImage){
          stage.avatarImage = `assets/images/${stage.avatarImage.split('/')[2]}`;
        }
      }
      this.saveStages();
      this.downloadDocumentStore();

      console.log(newStudyElement);


      newStudyElement.taskPage = `assets/modal/${newStudyElement.taskPage.split('/')[2]}`;
      FlowElements.insert(newStudyElement, (err, res) => {
        if (!err) console.log('Study Component created!', type, res);
        else console.error('Error while creating Study Component!', err);
      });
    }
    //Guardado de documentos
    downloadDocumentStore(){
      for (const newDoc of this.activeStudy.docs) {
        
        console.log('Downloading ' + newDoc.title);
        this.apply('fetchDocument', [ newDoc ], { noRetry: true }, (err, res) => {
          if (!err) {
            console.log('Downloaded!');
            this.completedElements += 1;
            console.log('docs', this.neededElements, this.completedElements);
            if(this.completedElements === this.neededElements){
              this.activeStudy.status = 'Completed';
            }
            console.log(res);
          }
          else {
            console.error('Error while downloading document', err);  
          }
        });
      }
    }
    //Guardado de preguntas
    saveQuestions(){
      for (const question of this.activeStudy.questions) {
        
        FormQuestions.insert(question, (err, res) => {
          if (!err) {
            console.log('Question created!', res, question);
          }
          else console.error('Error while creating Question Element!', err);
        });
      }
    }
    //Guardado de cuestionarios
    saveQuestionnaires(){
      for (const questionnaire of this.activeStudy.questionnaires) {
        FormQuestionnaires.insert(questionnaire, (err, res) => {
          if (!err) {
            console.log('Questionnaire created!', res, questionnaire);
          }
          else console.error('Error while creating Questionnaire Element!', err);
        });
      }
    }
    //Guardado de preguntas de sintesis
    saveSynthesis(){
      this.activeStudy.synthesis.forEach(synth => {
        let newSynth = {
          question: synth.title,
          synthesisId: synth.synthesisId
        }
        SynthesisQuestions.insert(newSynth, (err, res) => {
          if(!err){
            console.log('Synthesis created!', res, newSynth);
          }
          else console.error('Error while creating Synthesis Element', err);
        });
      });
    }
    //Guardado de cada etapa en el estudio
    saveStages(){
      this.activeStudy.study.stages.forEach(stage => {
        delete stage._v;
        delete stage.user;
        stage.state = stage.state.toLowerCase();
        if(stage.state.includes("criti")){
          stage.state = "criticalEval";
        }
        FlowElements.insert(stage, (err, res) => {
          if(!err){
            console.log('Stage created', res, stage);
          }
          else console.error('Error while creating Stage Element!', err);
        });
      });
    }
    //Carga de cada componente como dominio, tarea o locale
    loadFlowComponents(){
      let domain = task = locale = {};

      domain = this.activeStudy.study.domain;
      task = this.activeStudy.study.task;
      locale = this.activeStudy.study.locale;

      this.activeStudy.study.domain = domain.alias;
      this.activeStudy.study.task = task.alias;
      this.activeStudy.study.locale = locale.code;

      domain = {
        name: domain.name,
        type: 'domain',
        properties: {
          alias: domain.alias,
          code: domain.code,
          description: domain.description
        }
      }

      FlowComponents.insert(domain, (err, res) => {
        if (!err) console.log('Flow Component created!', 'domain', res);
        else console.error('Error while creating Flow Component!', err);
      });

      task = {
        name: task.name,
        type: 'task',
        properties: {
          alias: task.alias,
          code: task.code,
          description: task.description
        }
      }

      FlowComponents.insert(task, (err, res) => {
        if (!err) console.log('Flow Component created!', 'task', res);
        else console.error('Error while creating Flow Component!', err);
      });

      locale = {
        name: locale.name,
        type: 'locale',
        properties: {
          alias: locale.alias,
          code: locale.code,
          description: locale.description
        }
      }

      FlowComponents.insert(locale, (err, res) => {
        if (!err) console.log('Flow Component created!', 'locale', res);
        else console.error('Error while creating Flow Component!', err);
      });
    }
    //Obtencion del path de cada asset
    obtainAssetsPath(){
      for (const stage of this.activeStudy.stages) {
        if(stage.slides){
          for (const slide of stage.slides) {
            this.neededElements += 1;
            this.transferAsset(slide, 'image');
          }
        }
        if(stage.page){
          this.neededElements += 1;
          this.transferAsset(stage.page, 'template');
        }
        if(stage.tips){
          this.neededElements += 1;
          this.transferAsset(stage.tips, 'modal');
        }
      }
      if(this.activeStudy.study.taskPage){
        this.neededElements += 1;
        this.transferAsset(this.activeStudy.study.taskPage, 'modal');
      }
      if(this.activeStudy.study.locale.path){
        this.neededElements += 1;
        this.transferAsset(this.activeStudy.study.locale.path, 'locale');
      }
    }
    //Transferencia por medio de blob de los archivos assets
    transferAsset(path, type){
      console.log('transfering ', path, type);

      let fileName = path.split('/')[2];
      let fileExt = fileName.split('.')[1];

      let targetCollection = {};
      let fileType = '';

      if (type === 'locale'){ targetCollection = Locales;}
      else if (type === 'modal') {
        targetCollection = Modals;
        fileType = 'text/html';
      }
      else if (type === 'template') {
        targetCollection = Templates;
        fileType = 'text/html';
      }
      else if (type === 'image') {
        targetCollection = Images;
        fileType = 'image/' + fileExt;
      }
      else return false;

      let downloadUrl = this.urlStore + 'download';
      let data = { path }
      this.$http.post(downloadUrl, data, {responseType: "arraybuffer"}).then((response) => {
          //console.log(response.data);
          let blob = new Blob([response.data], {type: fileType});
          //console.log(blob);
          let file = new File([blob], fileName, {type: fileType});
          //console.log(file);
          const uploader = targetCollection.insert({
            file: file,
            streams: 'dynamic',
            chunkSize: 'dynamic'
          }, false);

          uploader.on('start', () => {
            let params = { message: `Loading template...` };
            //this.loading.start(params);
          });

          uploader.on('end', (err, fileObj) => {
            if (!err) {
              //this.loading.stop();
              this.completedElements += 1;
              if(this.completedElements === this.neededElements){
                this.activeStudy.status = 'Completed';
                alert('Creation of study completed!');
              }
              console.log('files', this.neededElements, this.completedElements);
              //console.log('File uploaded!', type, fileObj._id, fileObj.name);
              //alert(`${fileName} uploaded`);
            }
            else {
              //this.loading.stop();
              console.error('Error while uploading file!', err);
              alert(`Error while uploading file! ${fileName}. Try Again.`);
            }
          });

          uploader.start();
        }, (error) => {
          console.log(error);
      });

    }
}

const name = 'neuroneStore';

export default angular.module(name, [
])
.component(name, {
  template: template.default,
  controllerAs: name,
  controller: NeuroneStore
});