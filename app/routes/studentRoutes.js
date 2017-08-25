/**
 * Created by ARYA on 8/25/2017.
 */
var tarequest = require('../models/taRequest.js');

module.exports = function (app, passport) {
    app.post('/tarequest', function (req, res) {
        var profEmail = req.body.ProfessorEmail;
        var studentUser = req.user.local.email;
        var requestObject = new Object();
        requestObject.ProfessorEmail = profEmail;
        requestObject.StudentEmail = studentUser;

        tarequest.add(requestObject);
        res.json({'response': '200'});
    });
};