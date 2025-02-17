const dotenv = require('dotenv').config()
const express = require('express');
const app = express();
const PORT = process.env.PORT || 8000
const cors = require('cors');
const connectToDb = require('./config/connectToDB')
const helmet = require('helmet')
const rateLimiting = require('express-rate-limit')
const hpp = require('hpp')


app.use(rateLimiting({
  windowMs: 10 * 60 * 1000,
  max: 1200,
}))
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      ...helmet.contentSecurityPolicy.getDefaultDirectives(),
      "img-src": ["*", "data:"],
    },
  })
);
app.use(hpp())
app.use(express.json({ limit: '100mb' }))
app.use(cors({
  origin: 'http://localhost:5173',
  methods: "GET,POST,PUT,DELETE",
  credentials: true,
}))





app.use('/api', require('./routes/sendmail'));

// app.use('/api/emails', require('./routes/emails'));

app.get('/', (req, res) => {
  res.send('let the api go its not prepared for this get request^^');
});


app.listen(PORT, () => console.log('app started'));
connectToDb()

// XuP0zSfZEFSLNfYV
// aliahmed53253