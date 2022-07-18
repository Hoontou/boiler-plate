const { User } = require('../models/User');

let auth = (req, res, next) => {
  //인증처리

  //클라이언트의 쿠키에서 토큰 가져옴, 복호화 후

  //유저 유무에 따라 인증.

  let token = req.cookies.x_auth;

  User.findByToken(token, (err, user) => {
    if (err) throw err;
    if (!user) return res.json({ isAuth: false, err: true });

    req.token = token;
    req.user = user;
    next();
  });
};

module.exports = { auth };
