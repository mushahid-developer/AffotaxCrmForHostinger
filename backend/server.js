const express = require("express");
const dotenv = require('dotenv');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const connectDB = require('./server/database/connection');
require('./server/controller/RecurringTaskPing');

dotenv.config({ path: '../config.env' });
const PORT = process.env.PORT || 5000;

connectDB();

const app = express();

app.use(bodyParser.json());
app.use(cors());
app.use(morgan('tiny'));
app.use('/api', require('./server/routes/routes'));

if ( process.env.NODE_ENV == "production"){
    app.use(express.static("client/build"));
    const path = require("path");
    app.get("*", (req, res) => {
        res.sendFile(path.resolve(__dirname, '../frontend', 'build', 'index.html'));
    })
}

app.get('*', function (req, res) {
  res.send("404 Not Found");
});

app.listen(PORT, () => {
  console.log('************************************');
  console.log(' ********************************** ');
  console.log('  ********************************  ');
  console.log('   ******************************   ');
  console.log(`Server Started on http://localhost:${PORT}`);
  console.log('   ******************************   ');
  console.log('  ********************************  ');
  console.log(' ********************************** ');
  console.log('************************************');
});