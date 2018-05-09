var User = require('../model/user.model.js');
var LocalStrategy = require('passport-local').Strategy;
var GoogleStrategy = require('passport-google-oauth20').OAuth20Strategy;

var keys = require('../keys.js');

exports.create = function(req, res)
{
  if(req.user)
  {
    if(!req.body.ac_no || !req.body.ac_type || !req.body.fname || !req.body.branch_id)
    {
      res.json({'errorMessage': 'Please fillout all the details'});
    }

    User.find({'details.ac_no': req.body.ac_no}, function(err, user) {
      if(err)
        console.log(err);
      console.log(user);
    });

    if(req.user.local.email)
    {
      User.findOne({'local.email': req.user.local.email}, function(err, user) {
        if(err)
          console.log(err);


        if(user.details.length === 0)
        {
          var newUser = req.user;

          var detail = {
            ac_no: req.body.ac_no,
            ac_type: req.body.ac_type,
            balance: req.body.balance,
            branch_id: req.body.branch_id,
            fname: req.body.fname,
            lname: req.body.lname,
            bank_name: req.body.bank_name
          };

          newUser.details.push(detail);

          newUser.save(function(err, data){
            if(err)
              console.log(err);
            res.json(data);
          });
        } else if(user.details.length !== 0)
        {
          for(var i = 0; i < user.details.length; i++)
          {
            if(user.details[i].ac_no === req.body.ac_no)
            {
              res.json({'message': 'A/C already exists'});
            } else {
              var newUser = req.user;
              var detail = {
                ac_no: req.body.ac_no,
                ac_type: req.body.ac_type,
                balance: req.body.balance,
                branch_id: req.body.branch_id,
                fname: req.body.fname,
                lname: req.body.lname,
                bank_name: req.body.bank_name
              };

              newUser.save(function(err, data) {
                if(err)
                  console.log(err);
                res.json(data);
              });
            }
          }
        }
      });
      }
      else if(req.user.google.email)
      {
      User.findOne({'google.email': req.user.google.email}, function(err, user) {
        if(err)
          console.log(err);

        if(user.details.length)
        {
          var newUser = req.user;

          var detail = {
            ac_no: req.body.ac_no,
            ac_type: req.body.ac_type,
            balance: req.body.balance,
            branch_id: req.body.branch_id,
            fname: req.body.fname,
            lname: req.body.lname,
            bank_name: req.body.bank_name
          };

          newUser.details.push(detail);

          newUser.save(function(err, data){
            if(err)
              console.log(err);
            res.json(data);
          });
        } else if(user.details.length !== 0)
        {
          for(var i = 0; i < user.details.length; i++)
          {
            if(user.details[i].ac_no === req.body.ac_no)
            {
              res.json({'message': 'A/C already exists'});
            } else {
              var newUser = req.user;
              var detail = {
                ac_no: req.body.ac_no,
                ac_type: req.body.ac_type,
                balance: req.body.balance,
                branch_id: req.body.branch_id,
                fname: req.body.fname,
                lname: req.body.lname,
                bank_name: req.body.bank_name
              };

              newUser.save(function(err, data) {
                if(err)
                  console.log(err);
                res.json(data);
              });
            }
          }
        }
      });
    }
    }
  }
