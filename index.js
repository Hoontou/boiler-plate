const { urlencoded } = require('express');
const express = require('express');
const app = express();
const port = 5000;

const { User } = require('./models/User');
const config = require('./config/key');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const mongoose = require('mongoose');
mongoose
  .connect(config.mongoURI)
  .then(() => console.log('DB connected'))
  .catch((err) => console.log(err));

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.post('/register', (req, res) => {
  const user = new User(req.body);

  user.save((err, userInfo) => {
    if (err) return res.json({ success: false, err });
    return res.status(200).json({
      success: true,
    });
  });
});

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
