module.exports = function(app, passport)
{

  var api = require('../controller/user.api.js');


  //// GET paths

  app.get('/', function(req, res) {
    res.render('index.ejs', {});
  });

  app.get('/logout', isLoggedIn, function(req, res) {
    req.session.destroy(function() {
      req.user.google.token = null;
      res.clearCookie('connect.sid', { path: '/'}).status(200).redirect('/');
    });
  });

  app.get('/auth/user/', isLoggedIn, function(req, res) {
    res.render('home.ejs', { });
  });

  app.get('/auth/user/create', isLoggedIn, function(req, res) {
    res.render('create.ejs', {});
  });

  app.get('/auth/user/info', isLoggedIn, api.askInfo);

  app.get('/auth/user/sendMoney', isLoggedIn, function(req, res) {
    res.render('sendMoney.ejs', {});
  });

  app.get('/signup', function(req, res) {
    res.render('signup.ejs', {});
  });

  app.get('/login', function(req, res) {
    res.render('login.ejs', {});
  });

  /// POST paths

  app.post('/auth/user/create', isLoggedIn, api.create);

  app.post('/auth/user/info', isLoggedIn, api.info);

  app.post('/auth/user/sendMoney', isLoggedIn, api.sendMoney);

  //app.put('/auth/user/update', isLoggedIn, api.update);

  //app.delete('/auth/user/delete', isLoggedIn, api.delete);

  ///Login & signup

  app.post('/login', passport.authenticate('local-login', {
    successRedirect: '/auth/user/',
    failureRedirect: '/login',
    failureFlash: true
  }));

  app.post('/signup', passport.authenticate('local-signup', {
    successRedirect: '/login',
    failureRedirect: '/signup',
    failureFlash: true
  }));

  app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email']}));

  app.get('/auth/google/callback', passport.authenticate('google', {
    successRedirect: '/auth/user/',
    failureRedirect: '/',
    failureFlash: true
  }));

};

function isLoggedIn(req, res, next)
{
  if(req.isAuthenticated())
  {
    return next();
  } else {
    res.redirect('/');
  }
}
