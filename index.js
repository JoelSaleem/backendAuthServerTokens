// app starting point
const express = require('express');
const http = require('http'); // Native node library
const bodyParser = require('body-parser'); // Express middleware
const morgan = require('morgan'); // Express middleware
const cors = require('cors'); // Allow cors request from browser
const mongoose = require('mongoose');
const router = require('./router');
const app = express();


// mongoDB setup — set up a new local db called auth
mongoose.connect(
  'mongodb://localhost:27017/auth',
  {
    useNewUrlParser: true,
    useCreateIndex: true
  });

// App setup (setting up express)
// app.use registers as middleware
app.use(morgan('combined')); // logging framework — logs requests and responses
// Allow cors request from ANYWHERE — IN PROD WE WOULD WANT TO RESTRICT THIS
// and we can restrict this using cors, but we won't in this course
app.use(cors());
// parse incoming requests to json
app.use(bodyParser.json({ type: '*/*' }));
router(app);

// Server setup (getting server to talk to outside world)
const port = process.env.PORT || 3090;

// create http server that can receive http requests and forward them on to app
const server = http.createServer(app);
server.listen(port);
console.log('Server is listening on: ', port);
