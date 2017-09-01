
var User = require('../models/user');
var async = require('async');
var crypto = require('crypto');
var api_key = 'key-92037e9f088b0f8d850d6929ca7936ff';
var domain = 'sandboxfe21b99a90194e60ab5bc0c166073e31.mailgun.org';
var mailgun = require('mailgun-js')({apiKey: api_key, domain: domain});
var profModel = require('../models/professor.js');

module.exports = function(app, passport, path) {

    app.post('/sendMessage',function (req, res) {
        console.log(req.body);
        var msg = req.body.msg;
        var courseNo = req.body.courseNo;

        profModel.getProfessorModel().findOne({ProfessorEmail: req.user.local.email}, function (error, data) {
            for(var i = 0 ; i < data.Courses.length; i++){
                if(data.Courses[i].courseNo == courseNo){
                    if(data.Courses[i].messages != null){
                        var msgObject = new Object();
                        msgObject.sender = req.user.local.email;
                        msgObject.msg = msg;
                        msgObject.time = req.body.time;
                        data.Courses[i].messages.push(msgObject);
                    }
                    else {
                        data.Courses[i].messages = [];
                        var msgObject = new Object();
                        msgObject.sender = req.user.local.email;
                        msgObject.msg = msg;
                        msgObject.time = req.body.time;
                        data.Courses[i].messages.push(msgObject);
                    }
                    profModel.getProfessorModel().findOneAndUpdate({ProfessorEmail: req.user.local.email}, {$set: {Courses: data.Courses}}, function (error, doc) {
                        return res.json(doc);
                    });
                }
            }
        })
    });
    // =====================================
    // HOME PAGE (with login links) ========
    // =====================================
    app.get('/', function(req, res) {
        res.sendfile('./views/login.html');
        //res.render('index.ejs'); // load the index.ejs file
    });

    // =====================================
    // LOGIN ===============================
    // =====================================
    // show the login form
    app.get('/login', function(req, res) {

        // render the page and pass in any flash data if it exists
        res.sendfile('./views/login.html');
        //res.render('login.ejs', { message: req.flash('loginMessage') });
    });

    // process the login form
    app.post('/login', passport.authenticate('local-login', {
        successRedirect : '/profile', // redirect to the secure profile section
        failureRedirect : '/login', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));

    // =====================================
    // SIGNUP ==============================
    // =====================================
    // show the signup form
    app.get('/signup', function(req, res) {

        // render the page and pass in any flash data if it exists
        res.sendfile('./views/signup.html');
        //res.render('signup.ejs', { message: req.flash('signupMessage') });
    });

    // process the signup form
    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect : '/profile', // redirect to the secure profile section
        failureRedirect : '/signup', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));

    app.post('/signing', function (req, res, next) {
        async.waterfall([
            function(done) {
                crypto.randomBytes(20, function(err, buf) {
                    var token = buf.toString('hex');
                    done(err, token);
                });
                console.log("1");
            },
            function(token, done) {
            var newUser = new Object();
            //newUser.local.push({'email': req.body.email, 'PasswordToken': token, 'PasswordExpires': Date.now() + 3600000});
            newUser.local = new Object();
            newUser.local.email = req.body.email;
            newUser.local.PasswordToken = token;
            newUser.local.PasswordExpires = Date.now() + 3600000;
            new User({local: newUser.local}).save(function (err, doc, rows) {
                console.log(doc);
                done(err, token, doc);
                console.log("2");
            });

            },
            function(token, user, done) {
                var data = {
                    from: 'postmaster@sandboxfe21b99a90194e60ab5bc0c166073e31.mailgun.org',
                    to: user.local.email,
                    subject: 'Hello',
                    text: 'Testing some Mailgun awesomness!'
                };

                mailgun.messages().send(data, function (error, body) {
                    console.log(body);
                    return done(error, 'done');
                });

            }
        ], function(err) {
            if (err)
                console.log(err);
            return res.redirect('/forgot');
        });
    });

    // =====================================
    // PROFILE SECTION =====================
    // =====================================
    // we will want this protected so you have to be logged in to visit
    // we will use route middleware to verify this (the isLoggedIn function)
    app.get('/profile', isLoggedIn, function(req, res) {
        res.sendFile('bulma.html', {root : 'D://Files//University//Project//views'});
        /*res.render('bulma.html', {
            user : req.user // get the user out of session and pass to template
        });*/
    });

    // =====================================
    // LOGOUT ==============================
    // =====================================
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

};

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}