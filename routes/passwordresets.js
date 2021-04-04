const express = require('express');
const router = express.Router();
const ResetPassword = require('../models/resetPassword');
const Profile = require('../models/profile');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const config = require("../config.json");
const userUpdater = require('../api/api');

// const mongoose = require('mongoose');
// const connectionOptions = { useCreateIndex: true, useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false };
// mongoose.connect("mongodb://localhost/node-mongo-registration-login-api", connectionOptions);

// insert a new resetpassword 
router.post('/passwordresets', async (req, res) => {
  console.log(req.body);
  console.log("REALLLYYYY HERE FOR GOOD");

  try {
    const resetPassword = await ResetPassword.findOne({email: req.body.email});
    if (resetPassword) {
      console.log(JSON.stringify(resetPassword));
      // if we already have an existing password reset for the current user just update it (unique)
      try {
        const updatedResetPassword = await ResetPassword.updateOne(
          {email: req.body.email}, 
          { $set: {
            email: req.body.email,
            resetToken: req.body.resetToken
          }
        });
        res.json(updatedResetPassword);
      } catch(err) {
        res.status(400).json({message: err});
      }
    } else {
      const resetPassword = new ResetPassword({
        email: req.body.email,
        resetToken: req.body.resetToken
      });
      try {
        const savedResetPassword = await resetPassword.save();
        res.status(201).json(savedResetPassword);
      } catch (err) {
        res.status(400).json({ message: err });
      }
    }
  } catch(err) {
    res.status(404).json({message: err});
  }
});

// insert a new resetpassword 
router.post('/updatepassword', async (req, res) => {
  console.log(req.body);
  const email = req.body.email;
  const password = req.body.password;
  const urlWebToken = req.body.token;
  try {
    // first check to see if there exits a an username with that email
    const profile = await Profile.findOne({email: email});
    console.log(profile);
    if (profile) {
      try {
        // now check to see if that username has an uniquely generated token inside mongo database
        const resetPassword = await ResetPassword.findOne({email: email});
        console.log("resetPassword");
        console.log(resetPassword)
        console.log("urlWebToken");
        console.log(urlWebToken);
        if (resetPassword && (urlWebToken === resetPassword.resetToken)) { // here problem!!!!!
          try {
            // here we need to extract the token from resetPassword
            const token = resetPassword.resetToken;
            console.log(token);
            // now check to see if that token is valid and hasn't expired yet 
            jwt.verify(token, config.secret, (err, decoded) => {
              if (err) {
                console.log(err);
                return res.status(401).send();
              }
              // can do something with the decoded data
              // here we are when everything is fine
              try {
                const userId = profile.userId;
                console.log(userId);
                // if all of the above checks and are correct than make and update call to the user service
                // insert profile for freshly created user
                console.log('http://localhost:4000/users/' + userId);
                /*
                axios.put('http://localhost:4000/users/' + userId, {
                  id: userId,
                  email: email,
                  password: password
                }).then(res => {
                  console.log(`statusCode: ${res.statusCode}`);
                  console.log(res);
                }).catch(error => {
                  console.error(error);
                });
                */
                try {
                  userUpdater.updateUserData(userId, {
                    id: userId,
                    email: email,
                    password: password
                  });
                } catch (err) {

                }
              } catch (err) {
              }

            })
          } catch (err) {
          }
        }
      } catch (err) {
      }
    }
  } catch (err) {
  }
});


// puts a resetpassword at a specified id
router.put('/resetpassword/:id', async (req, res) => {
  try {
    const resetPassword = await ResetPassword.find({email: req.params.email});
    try {
      const updatedResetPassword = await ResetPassword.updateOne(
        {email: req.params.email}, 
        { $set: {
          email: req.body.email,
          resetToken: req.body.resetToken
        }
      });
      res.json(updatedResetPassword);
    } catch(err) {
      res.status(400).json({message: err});
    }
  } catch(err) {
    res.status(404).json({message: err});
  }
});

// get all passwordresets 
router.get('/passwordresetsall', async (req, res) => {
  try {
    const passwordresets = await ResetPassword.find();
    res.status(200).json(passwordresets);
  } catch(err) {
    res.status(200).json({message: err});
  }
});

// get all passwordresets 
router.get('/passwordresets/:id', async (req, res) => {
  try {
    const passwordresets = await ResetPassword.find({email: req.params.id});
    res.status(200).json(passwordresets);
  } catch(err) {
    res.status(200).json({message: err});
  }
});

// find resetpassword by id
router.get('/resetpassword/:id', async (req, res) => {
  console.log("here baby");
  const resetpassword = await ResetPassword.findOne({email: req.params.id});
  if (resetpassword) {
    res.status(200).json(resetpassword);
  } else {
    res.status(404).json({message: "Not Found"});
  }
});

// Delete a resetpassword
router.delete('/resetpassword/:id', async (req, res) => {
  try {
    const removedResetPassword = await ResetPassword.deleteOne({_id: req.params.id});
    res.status(200).json(removedResetPassword);
  } catch(err) {
    res.status(404).json({message: err});
  }
});

// Delete all passwordresets
router.delete('/reset', async (req, res) => {
  try {
    const removedResetPasswords = await ResetPassword.deleteMany();
    res.status(200).json(removedResetPasswords);
  } catch(err) {
    res.status(200).json({message: err});
  }
});

// Update a resetpassword
router.patch('/resetpassword/:id', async (req, res) => {
  try {
    const updatedResetPassword = await ResetPassword.updateOne(
      {_id: req.params.id }, 
      { $set: {
        email: req.body.email,
        resetToken: req.body.resetToken
      }
    });
    res.json(updatedResetPassword);
  } catch(err) {
    res.json({message: err});
  }
});

module.exports = router;