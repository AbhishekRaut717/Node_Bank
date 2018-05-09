var LocalStrategy = require('passport-local').Strategy;
var GoogleStrategy = require('passport-google-oauth20').OAuth20Strategy;

var keys = require('../keys.js');
var User = require('../model/user.model.js');

exports.create = function(req, res)
{
  if(req.user)
  {
    if(!req.body.ac_no || !req.body.ac_type || !req.body.fname || !req.body.branch_id)
    {
      res.json({'message': 'Please enter all the details'});
    }

    User.find({'details.ac_no': req.body.ac_no}, function(err, data) {
      if(err)
      {
        console.log(err);
        res.json({'message': 'error occured', err});
      }
      if(data[0])
      {
        console.log(data);
        res.json({'message': 'A/c no already exists ... Please contact admin'})
      }
      if(!data[0])
      {
        if(req.user.local.email)
        {
          User.findOne({'local.email': req.user.local.email}, function(err, user) {
            if(err)
            {
              console.log(err);
              res.json({'message': 'Error occured', err});
            }
            if(user)
            {
              var newUser = req.user;

              var detail = {
                ac_no: req.body.ac_no,
                ac_type: req.body.ac_type,
                balance: req.body.balance,
                branch_id: req.body.branch_id,
                fname: req.body.fname,
                lname: req.body.lname
              };

              newUser.details.push(detail);

              newUser.save(function(err, data) {
                if(err)
                {
                  console.log(err);
                  res.json({'message': 'Error occured', err});
                } else {
                  res.json(data);
                }

              })
            }
          })
        } else if(req.user.google.email)
        {
          User.findOne({'google.email': req.user.google.email}, function(err, user) {
            if(err)
            {
              console.log(err);
              res.json({'message': 'Error occured', err});
            }
            if(user)
            {
              var newUser = req.user;

              var detail = {
                ac_no: req.body.ac_no,
                ac_type: req.body.ac_type,
                balance: req.body.balance,
                branch_id: req.body.branch_id,
                fname: req.body.fname,
                lname: req.body.lname
              };

              newUser.details.push(detail);

              newUser.save(function(err, data) {
                if(err)
                {
                  console.log(err);
                  res.json({'message': 'Error occured', err})
                } else {
                  res.json(data);
                }
              });
            }
          });
        }
      }
    });
  }
}


exports.info = function(req, res)
{
  if(req.user.local.email)
  {
    // console.log(req.user.local.email);
    // console.log(req.body.ac_no);

    if(req.body.ac_no)
    {
      User.findOne({'local.email': req.user.local.email}, function(err, user) {
        if(err)
        {
          console.log(err);
          res.json({'message': 'Error occured', err});
        }
        if(user)
        {
          for(var i = 0; i < user.details.length; i++)
          {
            if(user.details[i].ac_no === req.body.ac_no)
            {
              data = user.details[i];
              res.render('sendInfo.ejs', { data : data });
            }
          }
        }
      });
    } else {
      res.json({'message': 'Please enter the A/C no for information'});
    }
  } else if(req.user.google.email)
  {
    if(req.body.ac_no)
    {
      User.findOne({'google.email': req.user.google.email}, function(err, user) {
        if(err)
        {
          console.log(err);
          res.json({'message': 'Error occured', err});
        }
        if(user)
        {
          for(var i = 0; i < user.details.length; i++)
          {
            if(user.details[i].ac_no === req.body.ac_no)
            {
              data = user.details[i];
              res.render('sendInfo.ejs', { data : data });
            }
          }
        }
      })
    } else {
      res.json({'message': 'Please enter the A/C no for information'});
    }
  }
}


exports.askInfo = function(req, res)
{
  if(req.user)
  {
    var data = [];

    for(var i = 0; i < req.user.details.length; i++)
    {
      var acInstance = req.user.details[i].ac_no;
      data.push(acInstance);

    }
    // console.log(data);
    res.render('askInfo.ejs', { data : data })
  }
}


exports.sendMoney = function(req, res)
{
  if(req.user)
  {
    if(!req.body.sender_ac_no || !req.body.receiver_ac_no || !req.body.receiver_email)
    {
      res.json({'message': 'Please enter all the details'});
    }

    if(req.user.local.email)
    {
      User.findOne({'local.email': req.user.local.email}, function(err, user1) {
        if(err)
        {
          console.log(err);
        }
        if(user1)
        {
          for(var i = 0; i < user1.details.length; i++)
          {
            if(user1.details[i].ac_no === req.body.sender_ac_no)
            {
              var initBalance = user1.details[i].balance;
              var chgBalance = parseInt(initBalance) - parseInt(req.body.amt);

              user1.details[i].balance = chgBalance;

              user1.save(function(err, savedData) {
                if(err)
                {
                  console.log(err);
                } else {
                    console.log(savedData);
                }
              });
            }
          }

          var receiver_email = req.body.receiver_email;
          User.findOne({'local.email': receiver_email}, function(err, user) {
            if(err)
            {
              console.log(err);
            }
            if(user)
            {
              for(var i = 0; i < user.details.length; i++)
              {
                if(user.details[i].ac_no === req.body.receiver_ac_no)
                {
                  var initBalance = user.details[i].balance;
                  var chgBalance = parseInt(initBalance) + parseInt(req.body.amt);

                  user.details[i].balance = chgBalance;

                  user.save(function(err, savedData) {
                    if(err)
                    {
                      console.log(err);
                    } else {
                      console.log('Transaction successful');
                    }
                  })
                }
              }
            }
          });

          User.findOne({'google.email': req.body.receiver_email}, function(err, user2) {
            if(err)
            {
              console.log(err);
            }
            if(user2)
            {
              for(var i = 0; i < user2.details.length; i++)
              {
                if(user2.details[i].ac_no === req.body.receiver_ac_no)
                {
                  var initBalance = user2.details[i].balance;
                  var chgBalance = parseInt(initBalance) + parseInt(req.body.amt);

                  user2.details[i].balance = chgBalance;

                  user2.save(function(err, savedData) {
                    if(err)
                    {
                      console.log(err);
                    } else {
                      console.log('Transaction successful');
                    }
                  })
                }
              }
            }
          })
        }
      });
    } else if(req.user.google.email)
    {
      User.findOne({'google.email': req.user.google.email}, function(err, user) {
        if(err)
        {
          console.log(err);
        }
        if(user)
        {
          for(var i = 0; i < user.details.length; i++)
          {
            if(user.details[i].ac_no === req.body.sender_ac_no)
            {
              var initBalance = user.details[i].balance;
              var chgBalance = parseInt(initBalance) - parseInt(req.body.amt);

              user.details[i].balance = chgBalance;

              user.save(function(err, savedData) {
                if(err)
                  console.log(err);
                console.log('Transaction successful');
              });
            }
          }

          User.findOne({'local.email': req.body.receiver_email}, function(err, user1) {
            if(err)
            {
              console.log(err);
            }
            if(user1)
            {
              for(var j = 0; j < user1.details.length; j++)
              {
                if(user1.details[j].ac_no === req.body.receiver_ac_no)
                {
                  var initBalance = user1.details[j].balance;
                  var chgBalance = parseInt(initBalance) + parseInt(req.body.amt);

                  user1.details[j].balance = chgBalance;

                  user1.save(function(err, savedData1) {
                    if(err)
                      console.log(err);
                    console.log('Transaction successful');
                  });
                }
              }
            }
          });

          User.findOne({'google.email' : req.body.receiver_email}, function(err, user2) {
            if(err)
            {
              console.log(err);
            }
            if(user2)
            {
              for(var k = 0; k < user2.details.length; k++)
              {
                if(user2.details[k].ac_no === req.body.receiver_ac_no)
                {
                  var initBalance = user2.details[k].balance;
                  var chgBalance = parseInt(initBalance) + parseInt(req.body.amt);

                  user2.details[k].balance = chgBalance;

                  user2.save(function(err, savedData2) {
                    if(err)
                      console.log(err);
                    console.log('Transaction successful');
                  });
                }
              }
            }
          });
        }
      });
    }
}
}
