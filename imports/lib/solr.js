// Configurations for solr-client
// Install solr server: https://www.digitalocean.com/community/tutorials/how-to-install-solr-5-2-1-on-ubuntu-14-04
import solr from 'solr-client';

class SolrClient {
  constructor() {
    this.options = {
      host: '127.0.0.1',
      port: 8983,
      path: '/solr',
      core: 'index'
    };

    this.client = solr.createClient(this.options);
    this.client.autoCommit = true;
  }

  addToIndex(docs) {
    this.client.add(docs,function(err,obj){
      if(err){
        console.log(err);
      }else{
        //console.log(obj);
      }
    });
  }

  ping() {
    this.client.ping(function(err,obj){
      if(err){
        console.log(err);
      }else{
        console.log(obj);
      }
    });
  }

  search(queryString) {
    var query = client.createQuery()
            .q(queryString)
            .dismax()
            //.qf({title_t : 0.2 , description_t : 3.3})
            .mm(2)
            .start(0)
            .rows(10);

    this.client.search(query,function(err,obj){
       if(err){
        console.log(err);
        return [];
       }else{
        console.log(obj);
        return obj;
       }
    });
  }

  clear() {
    var field = 'id';
    var query = '*'; // Everything !Dangerous!

    this.client.delete(field,query,function(err,obj){
       if(err){
        console.log(err);
       }else{
        console.log(obj); 
       }
    });
  }

  test() {
    console.log('Connected with solr-client!');
  }
}

export default SolrClient;


/*
options = {
  host: 'localhost',
  port: '8983',
  core: 'index'
};

client = solr.createClient(options);

client.autoCommit = true;

exports.addToIndex = function(docs) {
  client.add(docs,function(err,obj){
    if(err){
      console.log(err);
    }else{
      console.log(obj);
    }
  }); 
}

exports.ping = function() {
  client.ping(function(err,obj){
    if(err){
      console.log(err);
    }else{
      console.log(obj);
    }
  });
}

exports.search = function(queryString) {
  var query = client.createQuery()
          .q(queryString)
          .dismax()
          //.qf({title_t : 0.2 , description_t : 3.3})
          .mm(2)
          .start(0)
          .rows(10);

  client.search(query,function(err,obj){
     if(err){
      console.log(err);
      return [];
     }else{
      console.log(obj);
      return obj;
     }
  });
}

exports.clear = function() {
  var field = 'id';
  var query = '*'; // Everything !Dangerous!

  client.delete(field,query,function(err,obj){
     if(err){
      console.log(err);
     }else{
      console.log(obj); 
     }
  });
}

exports.test = function() {
  console.log('Connected with solr-client!');
}
*/