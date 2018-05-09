var LocalStrategy = require('passport-local').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

var User = require('../model/user.model.js');
var keys = require('../keys.js');

module.exports = function(passport)
{

		passport.serializeUser(function(user, done) {
	   return done(null, user.id);
	  });

	  //deserialize user from passport session
	  passport.deserializeUser(function(id, done) {
	    User.findById(id, (err, user) => {
	      done(err, user);
	    });
	  });

  passport.use('local-login', new LocalStrategy ({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
  },
  function(req, email, password, done) {
    if(email)
    {
      email = email.toLowerCase();

      process.nextTick(function() {
        //var auth = auth.local.email;
        User.findOne({ 'local.email': email}, function(err, user) {
          if(err)
          {
            console.log(err);
            return done(err);
          }
          if(!user)
          {
            console.log('No user with this email');
            return done(null, false, req.flash('loginMessage', 'No user found'));
          }
          if(!user.validatePassword(password))
          {
            console.log('Invalid Password');
            return done(null, false, req.flash('loginMessage', 'Invalid Password'));
          } else {
            return done(null, user);
          }
        });
      });
    }
  }));

  passport.use('local-signup', new LocalStrategy ({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
  },
  function(req, email, password, done) {
    if(email)
    {
      email = email.toLowerCase();


      process.nextTick(function() {
        if(!req.user)
        {
          User.findOne({'local.email': email}, function(err, user) {
            if(err)
            {
              console.log(err);
              return done(err);
            }
            if(user)
            {
              return done(null, false, req.flash('signupMessage','User alreay exists'));

            } else {
              var newUser = new User();
              newUser.local.email = email;
              newUser.local.password = newUser.generateHash(password);

              newUser.save(function(err, savedUser) {
                if(err)
                {
                  console.log(err);
                  return done(err);
                } else {
                  return done(null, savedUser);
                }
              });
            }
          });
        } else {
          return done(null, req.user);
        }
      });
    }
  }));



	passport.use(new GoogleStrategy({
	// Please provide your own clientID, clientSecret and callbackURL from your google+ API credentials instead of 'keys';
    clientID        : keys.clientID,
    clientSecret    : keys.clientSecret,
    callbackURL     : keys.callbackURL,
    //passReqToCallback : true // allows us to pass in the req from our route (lets us check if a user is logged in or not)

},
function(req, token, refreshToken, profile, done) {

    // asynchronous
    process.nextTick(function() {

        // check if the user is already logged in
        if (!req.user) {

            User.findOne({ 'google.id' : profile.id }, function(err, user) {
                if (err)
                    return done(err);

                if (user) {

                    // if there is a user id already but no token (user was linked at one point and then removed)
                    if (!user.google.token) {
                        user.google.token = token;
                        user.google.name  = profile.displayName;
                        user.google.email = (profile.emails[0].value || '').toLowerCase(); // pull the first email

                        user.save(function(err) {
                            if (err)
                                return done(err);

                            return done(null, user);
                        });
                    }

                    return done(null, user);
                } else {
                    var newUser          = new User();

                    newUser.google.id    = profile.id;
                    newUser.google.token = token;
                    newUser.google.name  = profile.displayName;
                    newUser.google.email = (profile.emails[0].value || '').toLowerCase(); // pull the first email

                    newUser.save(function(err) {
                        if (err)
                            return done(err);

                        return done(null, newUser);
                    });
                }
            });

        } else {
            // user already exists and is logged in, we have to link accounts
            var user               = req.user; // pull the user out of the session

            user.google.id    = profile.id;
            user.google.token = token;
            user.google.name  = profile.displayName;
            user.google.email = (profile.emails[0].value || '').toLowerCase(); // pull the first email

            user.save(function(err) {
                if (err)
                    return done(err);

                return done(null, user);
            });

        }

    });

}));

}
