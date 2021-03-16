const express = require('express');
const app = express();
const mongoose = require('mongoose');
require('dotenv/config')

const profilesRoutes = require('./routes/profiles');
const feedbacksRoutes = require('./routes/feedbacks');
const messagesRoutes = require('./routes/messages');
const documentsRoutes = require('./routes/documents');
const requestsRoutes = require('./routes/requests');
const resetPasswordsRoutes = require('./routes/passwordresets');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/', profilesRoutes);
app.use('/', feedbacksRoutes);
app.use('/', messagesRoutes);
app.use('/', documentsRoutes);
app.use('/', requestsRoutes);
app.use('/', resetPasswordsRoutes);

// see more in the routes folder 
app.get('/', (req, res) => {
    res.send('There is no place like /');
});

// now we have to set up default mongoose connection
mongoose.connect("mongodb://localhost/mongotube", {
    useNewUrlParser: true,
    useUnifiedTopology: true
    }, () => { 
        console.log('connected successfully to the database');
    }
);

// start the server
app.listen(5000);