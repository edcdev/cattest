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
    res.sendView('index.html');
});
app.get('ranks', function (req, res) {
    res.sendView('ranks.html');
});
io.sockets.on('connection', function (socket) {
    socket.on('print_cat', function () {
        request("https://latelier.co/data/cats.json", function(error, response, body) {
            body = body.split("\n");
            var cat = [];
            for (var i = 0; i < body.length; i++){
                if(body[i].match('url') !== null){
                    cat.push(body[i].match('url').input.substring(16).slice(0, -3));
                }
            }
            socket.emit('cats', cat)
        });
    });
    socket.on('upvote', function (cat, bad_cat) {
        request.post({url: 'http://localhost:1337/cats/url/', form: {url: cat}}, function (error, response, body) {
            if(body !== '[]'){
                console.log();
                body = JSON.parse(body)[0];
                request.post({url: 'http://localhost:1337/cats/vote', form: {id: body.id}});
            }
            else {
                request.post({url: 'http://localhost:1337/cats/create', form: {url: cat, votes: 1, views: 1}}, function (err, res, body) {
                    console.log(res.statusCode);
                });
            }
        });
        request.post({url: 'http://localhost:1337/cats/url/', form: {url: bad_cat}}, function (error, response, body) {
            if(body !== '[]'){
                body = JSON.parse(body)[0];
                request.post({url: 'http://localhost:1337/cats/view', form: {id: body.id}});
            }
            else {
                request.post({url: 'http://localhost:1337/cats/create', form: {url: bad_cat, votes: 0, views: 1}}, function (err, res, body) {
                    console.log(res.statusCode);
                });
            }
        })
    });
    socket.on('getRanks', function () {
        request('http://localhost:1337/cats', function (error, res, body) {
            
        });
    });
});