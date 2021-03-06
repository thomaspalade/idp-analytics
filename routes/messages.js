const express = require('express');
const router = express.Router();
const Message = require('../models/message');

// TODO: check if the above routes work (via postman, for instance)
// TODO: i personally tested the post and it works
// TODO: when adding a new model in database, you need to create a file just like this for rest API purposes
// for instance if adding the user model, you need to create users.js file here inside routes directory

// create and insert a new message inside database
router.post('/messages', async (req, res) => {
  console.log(req.body);

  const message = new Message({
    userId: req.body.userId,
    text: req.body.text
  });
  try {
    const savedMessage = await message.save();
    res.status(201).json(savedMessage);
  } catch (err) {
    res.status(400).json({ message: err });
  }
});

// puts a message at a specified id
router.put('/message/:id', async (req, res) => {
  try {
    // first check if there already is a message at the specified id
    const message = await Message.find({userId: req.params.id});
    try {
      // you don't have to set all the fields
      // the mongo api allows you update only one of the object's fields
      const updatedMessage = await Message.updateOne(
        {userId: req.params.id}, 
        { $set: {
          userId: req.body.userId,
          text: req.body.text
        }
      });
      res.json(updatedMessage);
    } catch(err) {
      res.status(400).json({message: err});
    }
  } catch(err) {
    res.status(404).json({message: err});
  }
});

// get all messages 
router.get('/messagesAll', async (req, res) => {
  try {
    const messages = await Message.find();
    res.status(200).json(messages);
  } catch(err) {
    res.status(200).json({message: err});
  }
});

// get all messages 
router.get('/messages/:id', async (req, res) => {
  try {
    const messages = await Message.find({userId: req.params.id});
    res.status(200).json(messages);
  } catch(err) {
    res.status(200).json({message: err});
  }
});

// find message by id
router.get('/message/:id', async (req, res) => {
  const message = await Message.findOne({userId: req.params.id});
  if (message) {
    res.status(200).json(message);
  } else {
    res.status(404).json({message: "Not Found"});
  }
});

// Delete a message
router.delete('/message/:id', async (req, res) => {
  try {
    const removedMessage = await Message.deleteOne({_id: req.params.id});
    res.status(200).json(removedMessage);
  } catch(err) {
    res.status(404).json({message: err});
  }
});

// Delete all messages
router.delete('/reset', async (req, res) => {
  try {
    const removedMessages = await Message.deleteMany();
    res.status(200).json(removedMessages);
  } catch(err) {
    res.status(200).json({message: err});
  }
});

// Update a message
router.patch('/message/:id', async (req, res) => {
  try {
    const updatedMessage = await Message.updateOne(
      {_id: req.params.id }, 
      { $set: {
        userId: req.body.userId,
        text: req.body.text
      }
    });
    res.json(updatedMessage);
  } catch(err) {
    res.json({message: err});
  }
});

module.exports = router;