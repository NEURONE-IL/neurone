// Configurations for solr
// Install solr server: https://www.digitalocean.com/community/tutorials/how-to-install-solr-5-2-1-on-ubuntu-14-04
import { HTTP } from 'meteor/http';

class SolrClient {
  constructor() {
    this.settings = {
      host: '127.0.0.1',
      port: 8983,
      path: '/solr',
      core: 'index'
    };

    this.requestSettings = {};

    /*
    url: queryurl,
    crossDomain: true,
    dataType:'jsonp',
    jsonpCallback: 'callback'
    */

    this.url = 'http://' + this.settings.host + ':' + this.settings.port + this.settings.path + '/' + this.settings.core;
    // http://localhost:8983/solr/index/query?indent=on&q=*:*&wt=json
  }

  addToIndex(docs) {

  }

  ping() {
    
  }

  search(queryString) {
    check(queryString, String);

    Future = Npm.require('fibers/future');    // TODO Elegant import
    var myFuture = new Future();

    var qt = '/query';
    var queryField = 'q=' + queryString;
    var querySettings = 'indent=on&wt=json';
    var finalUrl = this.url + qt + '?' + queryField + '&' + querySettings;

    console.log(finalUrl);

    HTTP.get(finalUrl, function(error, result) {
      if (!error) {
        var aux = result;
        console.log(aux);
        myFuture.return(aux);
      }
      else {
        console.log(error);
        myFuture.throw(error);
      }
    });

    return myFuture.wait();
  }

  clear() {
    
  }

  test() {
    console.log('Connected with solr-client!');
  }
}

export default SolrClient;