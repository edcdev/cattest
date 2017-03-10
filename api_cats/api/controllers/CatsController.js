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
        Cats.findOne({id: id}).exec(function (err, cat) {
            if (err){
                console.log(err)
            }
            else {
                cat.votes = Number(cat.votes) + 1;
                cat.views = Number(cat.views) + 1;
                console.log(cat);
                cat.save();
            }
        })
    }

};

