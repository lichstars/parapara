const express = require('express')
const cors = require('cors')
const http = require('http')
const stories = require('./dynamodb/stories.js')
const users = require('./dynamodb/users.js')
const app = express()
const port = process.env.PORT || 5000

var allowedOrigins = ['http://localhost:3000'];
app.use(cors({
  origin: function(origin, callback){
    if(!origin) return callback(null, true);
    if(allowedOrigins.indexOf(origin) === -1){
      var msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  }
}));

app.use(express.json())

app.get('/stories', (req, res) => stories.getAll(req, res))
app.get('/story', (req, res) => stories.get(req, res))
app.post('/new-story', (req, res) => stories.insert(req, res))
app.post('/update-story', (req, res) => stories.update(req, res))
app.post('/notify', (req, res) => stories.notify(req, res))
app.post('/new-user', (req, res) => users.insert(req, res))
app.post('/link-story', (req, res) => users.linkStory(req, res))

app.listen(port, () => console.log(`Server running at ${port}/`))
