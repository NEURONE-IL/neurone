// dgacitua: https://docs.meteor.com/v1.6/packages/webapp.html

import DocumentRetrieval from '../documentIndexer/documentRetrieval';
import DocumentDownloader from '../documentIndexer/documentDownloader';

const parseBody = (r) => {
  //console.log(r.method, r.url, r.headers);

  return new Promise((resolve, reject) => {
    let body = '';

    r.on('data', (chunk) => {
        body += chunk;
    });

    r.on('end', () => {
      //console.log(body);
      ret = JSON.parse(body);
      resolve(ret);
    });
  });
};

const parseResponse = (object) => {
  return JSON.stringify(object);
};


WebApp.connectHandlers.use('/v1/ping', (req, res, next) => {
  let response = { status: 'REST API OK!' };

  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(parseResponse(response)); 
});

WebApp.connectHandlers.use('/v1/document/search', async (req, res, next) => {
  try {
    let queryObj = await parseBody(req);
    let search = DocumentRetrieval.searchDocument(queryObj);

    //console.log(queryObj, search);

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(parseResponse(search));  
  }
  catch (error) {
    console.log(error);
  }  
});

WebApp.connectHandlers.use('/v1/document/load', async (req, res, next) => {
  try {
    let docObj = await parseBody(req);
    DocumentDownloader.fetch(docObj, (err, response) => {
      if(!err){
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(parseResponse(response));  
      }
      else{
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(parseResponse(err)); 
      }
    });
  }
  catch (error) {
    console.log(error);
  }  
});
