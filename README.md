# nwen304project1part2
This is my nwen304 project 1 part 2.

Instructions:
Run server with node bin/www in the terminal.
Go to localhost:8080 to try out the app in the non heroku version.
Test out heroku app:
https://davenodejsapp.herokuapp.com/
Curl Commands:
We can test ‘add’ by adding one item (named item) to the database:
curl -H "Content-Type: application/json" -X PUT -d '{"sendData":"item"}' 130.195.4.170:8080/add
We can then test delete by deleting this item from the database.
To test out whether the test_database is working, we will add multiple items to the database.
curl -H "Content-Type: application/json" -X PUT -d '{"sendData":"item1"}'
130.195.4.170:8080/add
curl -H "Content-Type: application/json" -X PUT -d '{"sendData":"item2"}'
130.195.4.170:8080/add
curl -H "Content-Type: application/json" -X PUT -d '{"sendData":"item3"}'
130.195.4.170:8080/add
Now I want to complete task item2. We can do this with the
‘/switchToComplete’ post.
This results in the following update to the database:
Now I can switch this back to incomplete using ‘switchToIncomplete’ post:
Note: Terminal response messages have since been updated to be more appropriate to the action.
Error Handling Example:
Request Error Handling used:
req.on('error', function (err) {
res.status(404, {message: "invalid request"});
});
Query Error handling used:
query.on('end', function() {
res.status(401).end;
});
For the front end (todo.js) I used a callback error function:
error: function(res){
alert("Item not deleted");
}
and also multiple .then calls on my ajax to a success function:
$.ajax({
url: "/switchToComplete",
type: "POST",
data: {taskName : taskName}
}).then(successful, ERROR_LOG);
function successful(){
console.log("successful");
}