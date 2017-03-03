var MongoClient = require('mongodb').MongoClient, assert = require('assert');
var dbUrl = 'mongodb://localhost:27017/wave-checker';
module.exports.DB = function(name, callback) {
    MongoClient.connect(dbUrl, function(err, db) {
        var collection = db.collection(name);
        if (typeof collection === undefined) {
            db.createCollection(name);
            collection = db.collection(name);
        }
        if (typeof callback === 'function') {
            callback(db, collection);
        }
    });
};

