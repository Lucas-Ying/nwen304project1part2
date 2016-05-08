# Todo-List project

This is my nwen304 todo list project part2.

#### How to running my system locally:
Run server with node bin/www in the terminal, then go to localhost:8080.

#### Heroku url:
https://nwen304project1part2.herokuapp.com/


#### REST Interface:
| API |
| -- |
| GET /api/test_database |
| POST /api/add |
| DELETE /api/delete |
| PUT /api/switchToComplete |
| PUT /api/switchToIncomplete |


#### Error Handling Example:
##### Request Error Handling used:
```
req.on('error', function (err) {
  res.status(404, {message: "invalid request"});
});
```

##### Query Error handling used:
```
query.on('end', function() {
  res.status(401).end;
});
```

##### For the front end (todo.js) I used a callback error function:
```
error: function(res){
  alert("Item not deleted");
}
```

##### multiple .then calls on my ajax to a success function:
```
$.ajax({
  url: "/switchToComplete",
  type: "POST",
  data: {taskName : taskName}
}).then(successful, ERROR_LOG);
function successful(){
  console.log("successful");
}
```

#### Curl test cases:
##### ‘add’ testing:
curl -H "Content-Type: application/json" -X POST -d '{"sendData":"item"}' http://localhost:8080/api/add

#####delete testing:
To test out whether the test_database is working, we will add multiple items to the database.

curl -H "Content-Type: application/json" -X POST -d '{"sendData":"item1"}'
http://localhost:8080/api/add

curl -H "Content-Type: application/json" -X DELETE -d '{"sendData":"item1"}'
http://localhost:8080/api/delete