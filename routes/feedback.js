const express = require('express');
const router = express.Router();
const Feedback = require('../models/feedback');

// insert a new feedback 
router.post('/feedbacks', async (req, res) => {
  console.log(req.body);

  const feedback = new Feedback({
    userId: req.body.userId,
    text: req.body.text
  });
  try {
    const savedFeedback = await feedback.save();
    res.status(201).json(savedFeedback);
  } catch (err) {
    res.status(400).json({ message: err });
  }
});

// puts a feedback at a specified id
router.put('/feedback/:id', async (req, res) => {
  try {
    const feedback = await Feedback.find({userId: req.params.id});
    try {
      const updatedFeedback = await Feedback.updateOne(
        {userId: req.params.id}, 
        { $set: {
          userId: req.body.userId,
          text: req.body.text
        }
      });
      res.json(updatedFeedback);
    } catch(err) {
      res.status(400).json({message: err});
    }
  } catch(err) {
    res.status(404).json({message: err});
  }
});

// get all feedbacks 
router.get('/feedbacksAll', async (req, res) => {
  try {
    const feedbacks = await Feedback.find();
    res.status(200).json(feedbacks);
  } catch(err) {
    res.status(200).json({message: err});
  }
});

// get all feedbacks 
router.get('/feedbacks/:id', async (req, res) => {
  try {
    const feedbacks = await Feedback.find({userId: req.params.id});
    res.status(200).json(feedbacks);
  } catch(err) {
    res.status(200).json({message: err});
  }
});

// find feedback by id
router.get('/feedback/:id', async (req, res) => {
  console.log("here baby");
  const feedback = await Feedback.findOne({userId: req.params.id});
  if (feedback) {
    res.status(200).json(feedback);
  } else {
    res.status(404).json({message: "Not Found"});
  }
});

// Delete a feedback
router.delete('/feedback/:id', async (req, res) => {
  try {
    const removedFeedback = await Feedback.deleteOne({_id: req.params.id});
    res.status(200).json(removedFeedback);
  } catch(err) {
    res.status(404).json({message: err});
  }
});

// Delete all feedbacks
router.delete('/reset', async (req, res) => {
  try {
    const removedFeedbacks = await Feedback.deleteMany();
    res.status(200).json(removedFeedbacks);
  } catch(err) {
    res.status(200).json({message: err});
  }
});

// Update a feedback
router.patch('/feedback/:id', async (req, res) => {
  try {
    const updatedFeedback = await Feedback.updateOne(
      {_id: req.params.id }, 
      { $set: {
        userId: req.body.userId,
        text: req.body.text
      }
    });
    res.json(updatedFeedback);
  } catch(err) {
    res.json({message: err});
  }
});

module.exports = router;