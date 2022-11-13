/*
 *   NodeJS script to handle the http requests
 */
"use strict";
var express = require('express');
var bodyParser = require('body-parser');
var loki = require('lokijs');
var crypto = require('crypto'); // To generate random UUID to associate as token

var router = express.Router();

// create text body parser
//var dataParser = bodyParser.text({type: 'text/plain'});
var dataParser = bodyParser.text();

// Define and initiate the in-memory DB for persisting the tokens
var tokensDB = new loki('Tokens');

var items = tokensDB.addCollection('items', { unique: [ 'item' ] });

/*
  Helper function to sanitize the provided request data string
  
  Parameters:
	dataStr = The request body containing the data string
  
  Returns:
	dataList = A list of strings from the input data string
*/
function sanitizeData(dataStr) {
  // Remove any [ or ] in the input data
  dataStr = dataStr.replace(/\[|\]/g, "");
  // Remove any single quote or double quotes in the input data
  dataStr = dataStr.replace(/\'|\"/g, "");
  
  var dataList = [];

  // Remove the newline characters and filter out any empty strings after the split
  if ((dataStr.indexOf('\r') > -1) || 
       (dataStr.indexOf('\n') > -1) ||
	   (dataStr.indexOf('\r\n') > -1)) {

    dataStr = dataStr.replace(/,/g, "");
    dataList = dataStr.split(/\r?\n/).filter((e) => e !== "");
	
  } else {
    // Split at comma if it is a single line data string
    dataList = dataStr.split(/,/).filter((e) => e !== "");
  }
  
  // Trim the whitespaces if any in the list of data strings
  for (let i = 0; i < dataList.length; i++) {
	  dataList[i] = dataList[i].trim();
  }

  return dataList;
}

// POST - tokenize method handler
router.post('/tokenize', dataParser, function(req, res, next) {
  var itemList =  sanitizeData(req.body);
  
  console.log("Tokenize method request data: ");
  console.log(itemList);
  
  // For each data item in the list, generate a UUID and store in-memory DB
  // Store the UUID in a list to return to the user
  var tokenList = [];
  var tokenRef = "";
  
  for (let i=0; i < itemList.length; i++) {
	try {
	  tokenRef = crypto.randomUUID();
	  items.insert( { item: itemList[i], token: tokenRef } );
      tokenList.push(tokenRef);
	} catch (e) {
	  console.log("Entry already exists for this item: " + itemList[i]);
	  tokenList.push('Item already exists - skipping: ' + itemList[i]);
	}
  }
  
  console.log("Tokenize method response data: ");
  console.log(tokenList);
  res.send(tokenList);
  //res.end(JSON.stringify(tokenList));
});

// POST - detokenize method handler
router.post('/detokenize', dataParser, function(req, res, next) {
  var tokenList =  sanitizeData(req.body);
  
  console.log("De-Tokenize method request data: ");
  console.log(tokenList);
  
  // For each token, retrieve the item from the stored values in-memory DB
  var itemList = [];
  var result;
  for (let i = 0; i < tokenList.length; i++) {
    result = items.find( { token: tokenList[i]} );
	if (result.length > 0) {
	  itemList.push(result[0].item);
	} else {
	  itemList.push("Item cannot be found for " + tokenList[i]);
	}
  }
  
  console.log("De-Tokenize method response data: ");
  console.log(itemList);
  res.send(itemList);
});


/* GET - default page */
router.get('/', function(req, res, next) {
  const name = process.env.NAME || 'ANZ Coding Exercise - a simple tokenization service in NodeJS with Express and LokiJS';
  var description = "The purpose of tokenization is to swap out sensitive data, \
					 typically payment card or bank account numbers, with a \
					 randomized string with no intrinsic value of its own.\
					 <br><br>\
					 The service should provide two HTTP endpoints,\
					 which will tokenize a collection of account numbers\
					 and another one to swap back the tokens for the\
					 original account numbers.\
					 <br><br><br>";
  res.send(`<b>${name}</b><br/><br/>` + description + Date());
});

module.exports = router;
