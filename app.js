const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');

app.use(express.json());
var cors = require('cors');
app.use(cors());

dotenv.config();

const messagesRoutes = require('./routes/messages');
// TODO: require each route individually here

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/', messagesRoutes);
// TODO: use each route individually here

// see more in the routes folder 
app.get('/', (req, res) => {
    res.send('There is no place like sugi pl danutu/');
});

// now we have to set up default mongoose connection
// tomi messing things up
mongoose.connect("mongodb://localhost/analyticsIDPdatabase", {
    useNewUrlParser: true,
    useUnifiedTopology: true
    }, () => { 
        console.log('connected successfully to the database');
    }
);

// start the server
app.listen(9999);   // PORT 999 -> this should have a getPort() function when running in PROD -> DOCKERFILE