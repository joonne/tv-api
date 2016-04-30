// config/passport.js

var LocalStrategy = require('passport-local').Strategy;

var User = require('../app/models/user');

module.exports = function(passport) {

    passport.serializeUser(function(user, done) {
      console.log("serializing user: " + user.id);
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
      console.log("deserializing user: " + id);
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

  	passport.use('local-signup', new LocalStrategy({
  		usernameField: 'email',
  		passwordField: 'password',
      passReqToCallback: true
    },

    function (req, email, password, done) {

      var username = req.body.username;

        process.nextTick(function() {

  		    User.findOne({ 'local.email': email }, function (err, user) {
            if(err) { return done(err); }
  			    if(user) {
  				     return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
  			    } else {

              console.log('creating new user: ' + email );

  				    var newUser = new User();

              newUser.local.email = email;
              newUser.local.username = username;
  				    newUser.local.password = newUser.generateHash(password);

  				    newUser.save(function(err) {
                if(err) throw err;
  					    return done(null, newUser);
              });
  			    }
  		     });
           });
      }));

    passport.use('local-login', new LocalStrategy({
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true
    },
    function(req, email, password, done) {

        // find a user whose email is the same as the forms email
        // we are checking to see if the user trying to login already exists
        User.findOne({ 'local.email' :  email }, function (err, user) {
            // if there are any errors, return the error before anything else
            if (err)
                return done(err);

            // if no user is found, return the message
            if (!user)
                return done(null, false, req.flash('loginMessage', 'No user found.' ));

            // if the user is found but the password is wrong
            if (!user.comparePassword(password))
                return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.' )); 

            // all is well, return successful user
            return done(null, user);
        });

    }));


}