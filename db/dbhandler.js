var MONGODB_PORT = 27017;
var mongoose = require('mongoose');
var MongoServerIP = "127.0.0.1";
var DBName = "University";

module.exports.initial = function (){
    mongoose.connect("mongodb://"+MongoServerIP+"/"+DBName,{
        useMongoClient: true
        /* other options */
    });
};




