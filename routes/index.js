var express = require('express');
var router = express.Router();

var pg = require('pg').native;
var connectionString = process.env.DATABASE_URL;
var client = new pg.Client(connectionString);
client.connect();

var api = '/api';

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get(api + '/test_database', function(request, response) {
// SQL Query > Select Data
  var query = client.query("SELECT * FROM todo");
  var results = [];
// Stream results back one row at a time
  query.on('row', function(row) {
    results.push(row);
  });
// After all data is returned, close connection and return results
  query.on('end', function() {
    response.json(results);
  });
});

// Put an item in the database.
router.post(api  + '/add', function(req,res){
  req.on('error', function (err) {
    res.status(404, {message: "invalid request"});
  });

  var query = client.query("insert into todo (item, completed) values ('" + req.body.sendData + "', false)");
  res.send({ response: "OK"})
  query.on('end', function() {
    res.status(401).end;
  });
});

// Delete an item in the database
router.delete(api + '/delete', function(req,res){
  req.on('error', function (err) {
    res.status(404, {message: "invalid request"});
  });
  var query = client.query("DELETE FROM todo WHERE item = '" + req.body.task + "'");
  res.send({ response: "OK"})
  query.on('end', function() {
    res.status(401).end;
  });
});

router.put(api + '/switchToComplete', function(req,res){
  req.on('error', function (err) {
    res.status(404, {message: "invalid request"});
  });

  var query = client.query("UPDATE todo SET completed = true WHERE item = '" + req.body.taskName + "'");
  res.send({ response: "OK"})
  query.on('end', function() {
    res.status(401).end;
  });
});

router.put(api + '/switchToIncomplete', function(req,res){
  req.on('error', function (err) {
    res.status(404, {message: "invalid request"});
  });
  var query = client.query("UPDATE todo SET completed = false WHERE item = '" + req.body.taskName + "'");
  res.send({ response: "OK"})
  query.on('end', function() {
    res.status(401).end;
  });
});

module.exports = router;