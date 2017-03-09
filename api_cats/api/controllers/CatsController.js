/**
 * CatsController
 *
 * @description :: Server-side logic for managing cats
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */


module.exports = {
    url: function(req, res){
        var name = req.param('url');
        console.log(name);
        Cats.find({url: name}).exec(function (err, url) {
            return res.json(url);
        })
    },
    vote: function (req, res) {
        var id = req.param('id');
        var vote = req.param('vote');
        var value = req.param('value');
        if (vote === 'up'){
            Cats.update({id: id},{upvote: value}).exec(function afterwards(err, updated) {
                if (!err){
                    return res.json('ok');
                }
            })
        }
        else if (vote === 'down'){
            Cats.update({id: id},{downvote: value}).exec(function afterwards(err, updated) {
                if (!err){
                    return res.json('ok');
                }
            })
        }
    }

};

