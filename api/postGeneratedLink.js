const express = require('express');
const ResetPassword = require('../models/resetPassword');

async function postGeneratedLink(req) {
  console.log("here inside postGeneratedLink");
  console.log(req);
  // router.post({email: req.email, resetToken: req.uniqueLink});
  try {
    console.log(JSON.stringify("here 1"));
    const email = req.email;
    const uniqueLink = req.uniqueLink;
    const resetPassword = await ResetPassword.findOne({email: email});
    console.log(JSON.stringify("here 2"));
    if (resetPassword) {
      console.log(JSON.stringify(resetPassword));
      // if we already have an existing password reset for the current user just update it (unique)
      try {
        const updatedResetPassword = await ResetPassword.updateOne(
          {email: email}, 
          { $set: {
            email: email,
            resetToken: uniqueLink
          }
        });
        res.json(updatedResetPassword);
      } catch(err) {
        res.status(400).json({message: err});
      }
    } else {
      console.log(JSON.stringify("didnt find anything... "));
      const resetPassword = new ResetPassword({
        email: email,
        resetToken: uniqueLink
      });
      console.log(JSON.stringify(resetPassword));
      try {
        console.log(JSON.stringify("here 1"));
        const savedResetPassword = await resetPassword.save();
        console.log(JSON.stringify("here 2"));
        res.status(201).json(savedResetPassword);
      } catch (err) {
        res.status(400).json({ message: err });
      }
    }
  } catch(err) {
    res.status(404).json({message: err});
  }
};


// const mongoose = require('mongoose');
// const connectionOptions = { useCreateIndex: true, useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false };
// mongoose.connect("mongodb://localhost/node-mongo-registration-login-api", connectionOptions);


// Export it to make it available outside
module.exports.postGeneratedLink = postGeneratedLink;