/**
 * Created by ARYA on 8/24/2017.
 */
var db = require('../../db/crawler.js');

module.exports = function (app, passport) {
    app.post('/Courses', function (req, res) {
        var CPModel = db.getCPModel();
        var result = new Object();
        result.courses = [];
        CPModel.find({'ProfessorName' : req.body.ProfessorName}, function(error, data) {
            if(data){
                for(var i = 0; i < data.length; i++){
                    result.courses.push(data[i].CourseName);
                }
                res.json(result);
            }
        });
    });
};