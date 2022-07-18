const mongoose = require('mongoose');
var jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { JsonWebTokenError } = require('jsonwebtoken');
const saltRounds = 10;

const userSchema = mongoose.Schema({
  name: {
    type: String,
    maxlength: 500,
  },
  email: {
    type: String,
    trim: true,
    unique: 1,
  },
  password: {
    type: String,
    minlength: 5,
  },
  lastname: {
    type: String,
    maxlength: 500,
  },
  role: {
    type: Number,
    default: 0,
  },
  image: String,
  token: {
    type: String,
  },
  tokenExp: {
    type: Number,
  },
});

userSchema.pre('save', function (next) {
  var user = this;

  if (user.isModified('password')) {
    //password가 바뀔때만 비밀번호를 암호화 시킨다.
    bcrypt.genSalt(saltRounds, function (err, salt) {
      if (err) return next(err);
      bcrypt.hash(user.password, salt, function (err, hash) {
        // Store hash in your password DB.
        if (err) return next(err);
        user.password = hash;
        next();
      });
    });
  } else {
    //아니면 걍 넘어가라.
    next();
  }
});

userSchema.methods.comparePassword = function (plainPassword, callbackF) {
  bcrypt.compare(plainPassword, this.password, function (err, isMatch) {
    if (err) return callbackF(err);
    callbackF(null, isMatch);
  });
};

userSchema.methods.generateToken = function (callbackF) {
  var user = this;
  var token = jwt.sign(user._id.toHexString(), 'secretToken');

  user.token = token;
  user.save((err, user) => {
    if (err) return callbackF(err);
    callbackF(null, user);
  });
};

userSchema.statics.findByToken = function (token, callbackF) {
  var user = this;
  jwt.verify(token, 'secretToken', function (err, decoded) {
    user.findOne({ _id: decoded, token: token }, function (err, user) {
      if (err) {
        console.log(err);
        return callbackF(err);
      }
      callbackF(null, user);
    });
  });
};

const User = mongoose.model('User', userSchema);

module.exports = { User };
