// dgacitua: https://docs.meteor.com/v1.6/packages/webapp.html

import DocumentRetrieval from "../documentIndexer/documentRetrieval";
import DocumentDownloader from "../documentIndexer/documentDownloader";
import MultimediaDownloader from "../multimediaIndexer/multimediaDownloader";
import { FlowComponents } from "../../imports/database/flowComponents/index";
import { Documents } from "../../imports/database/documents/index";
import {
  ImageSearch,
  Video,
  Book,
} from "../../imports/database/multimediaObjects";

// jmellado: https://stackoverflow.com/questions/36002493/no-access-control-allow-origin-header-in-angular-2-app
WebApp.rawConnectHandlers.use(function (req, res, next) {
  // Website you wish to allow to connect
  res.setHeader("Access-Control-Allow-Origin", "*");

  // Request methods you wish to allow
  //res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

  // Request headers you wish to allow
  // res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-access-token");

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  //res.setHeader('Access-Control-Allow-Credentials', true);
  return next();
});

const parseBody = (r) => {
  //console.log(r.method, r.url, r.headers);

  return new Promise((resolve, reject) => {
    let body = "";

    r.on("data", (chunk) => {
      body += chunk;
    });

    r.on("end", () => {
      //console.log(body);
      ret = JSON.parse(body);
      resolve(ret);
    });
  });
};

const parseResponse = (object) => {
  return JSON.stringify(object);
};

WebApp.connectHandlers.use("/v1/ping", (req, res, next) => {
  let response = { status: "REST API OK!" };

  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(parseResponse(response));
});

WebApp.connectHandlers.use("/v1/xd", (req, res, next) => {
  let flow = FlowComponents.findOne({ name: "domain5" });
  console.log(flow == null);

  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(parseResponse(flow));
});

WebApp.connectHandlers.use("/v1/document/search", async (req, res, next) => {
  try {
    let queryObj = await parseBody(req);
    let search = DocumentRetrieval.searchDocument(queryObj);

    //console.log(queryObj, search);

    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(parseResponse(search));
  } catch (error) {
    console.log(error);
  }
});

WebApp.connectHandlers.use("/v1/document/load", async (req, res, next) => {
  let docObj = await parseBody(req);
  let domain = await FlowComponents.findOne({
    name: docObj.domain[0],
    type: "domain",
  });
  let task = await FlowComponents.findOne({
    name: docObj.task[0],
    type: "task",
  });
  let locale = await FlowComponents.findOne({
    name: docObj.locale,
    type: "locale",
  });
  if (domain == null) {
    await FlowComponents.insert({ name: docObj.domain[0], type: "domain" });
  }
  if (task == null) {
    await FlowComponents.insert({ name: docObj.task[0], type: "task" });
  }
  if (locale == null) {
    await FlowComponents.insert({ name: docObj.locale, type: "locale" });
  }
  if (docObj.type == "book" || docObj.type == "video") {
    try {
      MultimediaDownloader.indexMultimedia(docObj, (err, response) => {
        if (!err) {
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(parseResponse(response));
        } else {
          res.writeHead(400, { "Content-Type": "application/json" });
          res.end(parseResponse(err));
        }
      });
    } catch (error) {
      console.log(error);
    }
  } else {
    try {
      DocumentDownloader.fetch(docObj, (err, response) => {
        if (!err) {
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(parseResponse(response));
        } else {
          res.writeHead(400, { "Content-Type": "application/json" });
          res.end(parseResponse(err));
        }
      });
    } catch (error) {
      console.log(error);
    }
  }
});

WebApp.connectHandlers.use(
  "/v1/document/delete",
  async (req, response, next) => {
    let docObj = await parseBody(req);
    let deletedDoc = { ...docObj };

    if (deletedDoc.type == "video") {
      Video.remove(deletedDoc._id, (err, res) => {
        if (!err) {
          try {
            MultimediaDownloader.deleteFile(deletedDoc);
            DocumentRetrieval.reindex();
          } catch (error) {
            response.writeHead(400, { "Content-Type": "application/json" });
            response.end(parseResponse(error));
          }
        } else {
          response.writeHead(400, { "Content-Type": "application/json" });
          response.end(parseResponse(err));
        }
      });
      response.writeHead(200, { "Content-Type": "application/json" });
      response.end(parseResponse(deletedDoc));
    } else if (deletedDoc.type == "book") {
      Book.remove(deletedDoc._id, (err, res) => {
        if (!err) {
          try {
            MultimediaDownloader.deleteFile(deletedDoc);
            DocumentRetrieval.reindex();
          } catch (error) {
            response.writeHead(400, { "Content-Type": "application/json" });
            response.end(parseResponse(error));
          }
        } else {
          response.writeHead(400, { "Content-Type": "application/json" });
          response.end(parseResponse(err));
        }
      });
      response.writeHead(200, { "Content-Type": "application/json" });
      response.end(parseResponse(deletedDoc));
    } else {
      Documents.remove(deletedDoc._id, (err, res) => {
        if (!err) {
          ImageSearch.find({ route: deletedDoc._id })
            .fetch()
            .forEach((element) => {
              ImageSearch.remove(element._id, (err, res) => {
                if (!err) {
                  console.log("Image deleted from Database!", element._id);
                } else {
                  console.error(
                    "Cannot delete document images!",
                    element._id,
                    err
                  );
                }
              });
            });
          try {
            MultimediaDownloader.deleteFile(deletedDoc);
            DocumentRetrieval.reindex();
          } catch (error) {
            response.writeHead(400, { "Content-Type": "application/json" });
            response.end(parseResponse(error));
          }
          response.writeHead(200, { "Content-Type": "application/json" });
          response.end(parseResponse(deletedDoc));
        } else {
          console.error("Cannot delete document!", deletedDoc.docId, err);
          response.writeHead(400, { "Content-Type": "application/json" });
          response.end(parseResponse(err));
        }
      });
    }
  }
);
