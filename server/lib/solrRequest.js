// Configurations for solr
// Install solr server: https://www.digitalocean.com/community/tutorials/how-to-install-solr-5-2-1-on-ubuntu-14-04
import { HTTP } from 'meteor/http';

export const settings = {
      host: process.env.SOLR_URL ? process.env.SOLR_URL : 'http://127.0.0.1',
      port: 8983,
      path: '/solr',
      core: 'index'
    };

export const baseUrl = settings.host + ':' + settings.port + settings.path + '/' + settings.core;

export function searchIndex(queryString) {
  return new Promise(function(resolve, reject) {
    var qt = '/query';
    var queryField = 'q=' + queryString;
    var querySettings = 'indent=on&wt=json';
    var finalUrl = baseUrl + qt + '?' + queryField + '&' + querySettings;

    HTTP.call('GET', finalUrl, function(error, result) {
      if (!error) {
        var aux = JSON.parse(result.content);
        //console.log('Succesfull call to Solr!', aux);
        resolve(aux);
      }
      else {
        console.log(error);
        reject(error);
      }
    });
  })
}

export function addToIndex(doc) {

}

export function clearIndex() {

}

export function pingIndex() {

}