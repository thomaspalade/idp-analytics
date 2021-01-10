const express = require('express');
const app = express();
const mongoose = require('mongoose');
require('dotenv/config')

const profilesRoutes = require('./routes/profiles');
const feedbacksRoutes = require('./routes/feedback');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/', profilesRoutes);
app.use('/', feedbacksRoutes);

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