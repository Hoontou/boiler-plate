import React, { useState } from 'react';
import Axios from 'axios';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../../../_actions/user_action';
function LoginPage(props) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [Email, setEmail] = useState('');
  const [Password, setPassword] = useState('');

  const onEmailHandler = (event) => {
    setEmail(event.currentTarget.value);
  };

  const onPasswordHandler = (event) => {
    setPassword(event.currentTarget.value);
  };

  const onSubmitHandler = (event) => {
    event.preventDefault();

    let body = {
      email: Email,
      password: Password,
    };

    dispatch(loginUser(body)).then((response) => {
      if (response.payload.loginSuccess) {
        navigate('/');
      } else {
        alert(response.payload.msg);
      }
    });
  };

  return (
    <div class='login-page'>
      <div class='form'>
        <form class='login-form' onSubmit={onSubmitHandler}>
          <label>Email</label>
          <input type='email' value={Email} onChange={onEmailHandler} />
          <label>Password</label>
          <input
            type='password'
            value={Password}
            onChange={onPasswordHandler}
          />
          <br />
          <button type='submit'>Login</button>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
