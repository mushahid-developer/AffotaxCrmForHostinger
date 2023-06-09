//Import
const express = require("express");
const dotenv = require('dotenv');
const morgan = require('morgan');
const bodyParser = require('body-parser');
var cors = require('cors')

// Import MongoDb Connection file
const connectDB = require('./server/database/connection');

//Import Cron Job file to run it
require('./server/controller/RecurringTaskPing');

// initialization App
const app = express();

// Setting Port Number
dotenv.config('../config.env');
const PORT = process.env.PORT || 5000;

// Mongo DB Connection
connectDB();

// // Json Parsing
app.use(bodyParser.json());

// Cors
app.use(cors())

//Log Requests
app.use(morgan('tiny'));

// Load Routes
app.use('/api', require('./server/routes/routes'));


app.get("*", (req, res) => {
    res.sendFile(path.join("../frontend/build", "index.html"));
  });
  


app.get('*', function (req, res) {
    res.send("404 Not Found");
});






app.listen(PORT, ()=>{
    console.log('************************************')
    console.log(' ********************************** ')
    console.log('  ********************************  ')
    console.log('   ******************************   ')
    console.log(`Server Started on http://localhost:${PORT}`)
    console.log('   ******************************   ')
    console.log('  ********************************  ')
    console.log(' ********************************** ')
    console.log('************************************')
})