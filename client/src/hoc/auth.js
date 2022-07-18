import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { auth } from '../_actions/user_action';
import { useNavigate } from 'react-router-dom';

export default function (SpecificComponent, option, adminRoute = null) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  function AuthenticationCheck(props) {
    useEffect(() => {
      dispatch(auth()).then((response) => {
        console.log(response);
      });
    }, []);

    return <SpecificComponent {...props} />;
  }
  return AuthenticationCheck;
}
