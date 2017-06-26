import { Documents } from '../../imports/database/documents/index';

export default class DocumentRetrieval {
  static getDocument(documentName, callback) {
    check(documentName, String);

    var doc = Documents.findOne({ _id: documentName });

    if (doc && doc._id && doc.route) {
      doc.routeUrl = '/' + doc.route;
      callback(null, doc);
    }
    else {
      var err = 'Document not found!';
      callback(err);
    }
  }

  // dgacitua: Custom sorting algorithm for iFuCo Project
  // PARAMS:  documentArray  Array with resulting documents from Lunr
  //          insertions     Algorithm will check from first to <insertions> position for relevant documents
  //          offset         Algorithm will insert a relevant document at this position (1 is first position)
  static iFuCoSort(documentArray, insertions, offset) {
    check(documentArray, Array);
    check(insertions, Number);
    check(offset, Number);

    // iFuCoSort v3
    var newArray = documentArray,
       insertNum = newArray.length < insertions ? newArray.length : insertions,
       offsetPos = newArray.length < offset ? newArray.length : offset;

    if (newArray.length >= 2 && newArray[0].relevant) {
      for (var k=0; k<newArray.length; k++) {
        if (!newArray[k].relevant) {
          newArray = this.moveInArray(newArray, k, 0);
          break;
        }
      }        
    }

    for (var i=0; i<insertNum; i++) {
      if (newArray[i].relevant) return newArray;
    }

    for (var j=0; j<newArray.length; j++) {
      if (newArray[j].relevant) {
        newArray = this.moveInArray(newArray, j, offsetPos-1);
        return newArray;  
      }
    }

    return newArray;

    // dgacitua: Old iFuCoSort algorithms are kept for reference

    // iFuCoSort v2
    /*
    var insertNum = documentArray.length < insertions ? documentArray.length : insertions,
        offsetPos = documentArray.length < offset ? documentArray.length : offset;

    for (var i=0; i<insertNum; i++) {
      if (documentArray[i].relevant === true) return documentArray;
    }

    for (var j=0; j<documentArray.length; j++) {
      if (documentArray[j].relevant === true) {
        documentArray.move(j, offsetPos-1);
        return documentArray;  
      }
    }

    return documentArray;
    */

    // iFuCoSort v1
    /*
    var relevantDocs = this.shuffleArray(Documents.find({ relevant: true }).fetch()),
           insertNum = relevantDocs.length < insertions ? relevantDocs.length : insertions,
           offsetNum = (documentArray.length < offset ? documentArray.length : offset) - 1;

    for (i=0; i<insertNum; i++) {
      var index = documentArray.indexOf(relevantDocs[i]);

      if (index != -1) {
        documentArray.move(index, offsetNum);
      }
      else {
        documentArray.splice(offsetNum, 0, relevantDocs[i]);
      }
    }

    return this.removeArrayDuplicates(a => a._id, documentArray);
    */
  }

  // dgacitua: http://stackoverflow.com/a/5306832
  static moveInArray(array, old_index, new_index) {
    while (old_index < 0) {
      old_index += array.length;
    }
    while (new_index < 0) {
      new_index += array.length;
    }
    if (new_index >= array.length) {
      var k = new_index - array.length;
      while ((k--) + 1) {
        array.push(undefined);
      }
    }
    
    array.splice(new_index, 0, array.splice(old_index, 1)[0]);

    return array;
  }
}