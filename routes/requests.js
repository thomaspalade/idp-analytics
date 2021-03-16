const express = require('express');
const router = express.Router();
const Request = require('../models/request');
// const Profile = require('../models/profile');

// insert a new request 
router.post('/requests/:id', async (req, res) => {
  console.log(req.body);

  console.log("here baby");

  const request = new Request({
    userId: req.body.userId,
    name: req.body.name,
    description: req.body.description,
    documentType: req.body.documentType,
    city: req.body.city,
    county: req.body.county,
    institution: req.body.institution
  });
  try {
    const savedRequest = await request.save();
    /*
    try {
      const profile = await Profile.find({userId: req.params.id});
      try {
          const updatedProfile = await Profile.updateOne(
              { userId: req.params.id }, 
              { $push: {
                requestedDocumentsIds: req.body.
              }
          });
          res.json(updatedProfile);
      } catch(err) {
          res.status(400).json({message: err});
      }
    } catch(err) {
      res.status(404).json({message: err});
    }
    */
    res.status(201).json(savedRequest);
  } catch (err) {
    res.status(400).json({ request: err });
  }
});

// puts a request at a specified id
router.put('/request/:id', async (req, res) => {
  try {
    const request = await Request.find({userId: req.params.id});
    try {
      const updatedRequest = await Request.updateOne(
        { userId: req.params.id }, 
        { $set: {
          userId: req.body.userId,
          name: req.body.name,
          description: req.body.description,
          documentType: req.body.documentType,
          city: req.body.city,
          county: req.body.county,
          institution: req.body.institution
        }
      });
      res.json(updatedRequest);
    } catch(err) {
      res.status(400).json({request: err});
    }
  } catch(err) {
    res.status(404).json({request: err});
  }
});

// get all requests 
router.get('/messagesAll', async (req, res) => {
  try {
    const requests = await Request.find();
    res.status(200).json(requests);
  } catch(err) {
    res.status(200).json({request: err});
  }
});

// get all requests 
router.get('/requests/:id', async (req, res) => {
  try {
    const requests = await Request.find({userId: req.params.id});
    res.status(200).json(requests);
  } catch(err) {
    res.status(200).json({request: err});
  }
});

// find request by id
router.get('/request/:id', async (req, res) => {
  const request = await Request.findOne({userId: req.params.id});
  if (request) {
    res.status(200).json(request);
  } else {
    res.status(404).json({request: "Not Found"});
  }
});

module.exports = router;