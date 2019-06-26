var MongoClient = require('mongodb').MongoClient;
var dburl = 'mongodb://localhost:27017';
// var dburl = 'mongodb://site181918:aiJa2iez@mongo_site181918:27017';

var _connection = null;

var open = function(){
    MongoClient.connect(dburl, { useNewUrlParser: true }, function(err, client){
        if (err) {
            console.log("Connessione al db fallita");
            return;
        }
        _connection = client.db("whereami");
        console.log("Db connesso")
    });
}

var get = function(){
    return _connection;
}

module.exports = {
    open: open,
    get: get
}