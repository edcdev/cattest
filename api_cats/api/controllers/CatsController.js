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
    }

};

