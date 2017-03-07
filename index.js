var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var ejs = require('ejs');
var mongoose = require('mongoose');
var request = require('request');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/');

//debugging

http.listen(3000, function () {
    console.log('listening on *:3000');
});

//middleware for absolute path

function sendView(req, res, next) {
    res.sendView = function(view) {
        return res.sendFile(__dirname + "/assets/view/" + view);
    };
    next();
}
app.use(sendView);

// routing

app.get('/', function (req, res) {
    request("https://latelier.co/data/cats.json", function(error, response, body) {
        console.log(body);
    });
    res.sendView('index.html');
});