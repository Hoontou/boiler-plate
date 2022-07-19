const { urlencoded } = require('express');
const express = require('express');
const app = express();
const port = 5000;
const cookieParser = require('cookie-parser');
const morgan = require('morgan');

const { auth } = require('./middleware/auth');
const { User } = require('./models/User');
const config = require('./config/key');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan('dev'));

const mongoose = require('mongoose');
mongoose
  .connect(config.mongoURI)
  .then(() => console.log('DB connected'))
  .catch((err) => console.log(err));

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.post('/api/users/register', (req, res) => {
  console.log(req.body);
  const user = new User(req.body);

  user.save((err, userInfo) => {
    if (err) {
      console.log(err);
      return res.json({ success: false, err });
    }
    return res.status(200).json({
      success: true,
    });
  });
}); //사인 인

app.post('/api/users/login', (req, res) => {
  User.findOne({ email: req.body.email }, (err, user) => {
    if (!user) {
      return res.json({
        loginSuccess: false,
        msg: '제공된 이메일에 해당하는 유저가 없습니다.',
      });
    }
    user.comparePassword(req.body.password, (err, isMatch) => {
      if (!isMatch)
        return res.json({ loginSuccess: false, msg: '비밀번호가 틀렸음' });
      user.generateToken((err, user) => {
        if (err) return res.status(400).send(err);
        res
          .cookie('x_auth', user.token)
          .status(200)
          .json({ loginSuccess: true, userId: user._id });
      });
    });
  });
}); //로그인

app.get('/api/users/auth', auth, (req, res) => {
  //중간에 auth는 미들웨어
  //auth 미들웨어를 통과(auth확인됨)해서 다음 코드 실행
  res.status(200).json({
    _id: req.user._id,
    isAdmin: req.user.role === 0 ? false : true,
    isAuth: true,
    email: req.user.email,
    name: req.user.name,
    lastname: req.user.lastname,
    role: req.user.role,
    image: req.user.image,
  });
}); //인증

app.get('/api/users/logout', auth, (req, res) => {
  User.findOneAndUpdate({ _id: req.user._id }, { token: '' }, (err, user) => {
    if (err) return res.json({ success: false, err });
    return res.status(200).json({ success: true });
  });
});

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
