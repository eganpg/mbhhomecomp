/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /things              ->  index
 * POST    /things              ->  create
 * GET     /things/:id          ->  show
 * PUT     /things/:id          ->  update
 * DELETE  /things/:id          ->  destroy
 */

'use strict';

var _ = require('lodash');

var fs=require("fs");
var Thing = require('./thing.model');
var prettyjson = require('prettyjson');
var Zillow = require('node-zillow');
var Converter=require("csvtojson").core.Converter;
 
//Instantiate 
var zillow = new Zillow('X1-ZWz1a9beml4cgb_7rj5m');

// Get list of things
exports.index = function(req, res) {
  Thing.find(function (err, things) {
    if(err) { return handleError(res, err); }
    return res.json(200, things);
  });
};

exports.getzillow = function(req, res) {
  console.log(req.params.ad);
  var ad = req.params.ad;
  var address = ad.split(',');
  console.log(address);
  var getResults = zillow.getDeepSearchResults({
        address: address[0],
        city: address[1],
        state: address[2],
        zip: address[3]
      });
      console.log(getResults)
      getResults.then(function(result){
        console.log(result.response[0].results[0].result);
        var deets = result.response[0].results[0].result
        return res.json(200, deets);
      });
}
exports.parse = function(req, res) {
  console.log('made it here');
  var csvFileName="./MBHtest.csv";
  var fileStream=fs.createReadStream(csvFileName);
  //new converter instance 
  var param={};
  var csvConverter=new Converter(param);
   var address = []
  //end_parsed will be emitted once parsing finished 
  csvConverter.on("end_parsed",function(jsonObj){
     
     for(var i = 0;i < 80;i++){
      console.log(jsonObj[i]['Property (Click Link to Edit Details): Street'] + ' ' + jsonObj[i]['Property (Click Link to Edit Details): City'] + ' ' + jsonObj[i]['Property (Click Link to Edit Details): State'] + ' ' + jsonObj[i]['Property (Click Link to Edit Details): Zip Code']); //here is your result json object 
      address.push(jsonObj[i]['Property (Click Link to Edit Details): Street'] + ', ' + jsonObj[i]['Property (Click Link to Edit Details): City'] + ', ' + jsonObj[i]['Property (Click Link to Edit Details): State'] + ', ' + jsonObj[i]['Property (Click Link to Edit Details): Zip Code'])
     }
    console.log(address);
     return res.json(200, address);
  });
   
  //read from file 
  fileStream.pipe(csvConverter);
      

  }



// Get a single thing
exports.show = function(req, res) {
  Thing.findById(req.params.id, function (err, thing) {
    if(err) { return handleError(res, err); }
    if(!thing) { return res.send(404); }
    return res.json(thing);
  });
};

// Creates a new thing in the DB.
exports.create = function(req, res) {
  Thing.create(req.body, function(err, thing) {
    if(err) { return handleError(res, err); }
    return res.json(201, thing);
  });
};

// Updates an existing thing in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Thing.findById(req.params.id, function (err, thing) {
    if (err) { return handleError(res, err); }
    if(!thing) { return res.send(404); }
    var updated = _.merge(thing, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, thing);
    });
  });
};

// Deletes a thing from the DB.
exports.destroy = function(req, res) {
  Thing.findById(req.params.id, function (err, thing) {
    if(err) { return handleError(res, err); }
    if(!thing) { return res.send(404); }
    thing.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}