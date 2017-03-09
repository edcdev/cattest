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
    socket.on('upvote', function (cat) {
        console.log(cat);
        request.post({url: 'http://localhost:1337/cats/url/', form: {url: cat}}, function (error, response, body) {
                if(body !== '[]'){
                    request.post({url: 'http://localhost:1337/cats/update/'+body.id, form: {upvote: body.upvote + 1}});
                    console.log(response.statusCode)
                }
                else {
                    request.post({url: 'http://localhost:1337/cats/create', form: {url: cat, upvote: 1}}, function (err, res, body) {
                        console.log(res.statusCode);
                    });
                    console.log('non');
                }
        })
    });
});