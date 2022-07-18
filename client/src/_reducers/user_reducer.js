import { LOGIN_USER, REGISTER_USER } from '../_actions/types';

export default function (state = {}, action) {
  switch (action.type) {
    case LOGIN_USER:
      return { ...state, loginSuccess: action.payload }; ///...state는 그냥 위에걸 그대로 가져오는 거고 빈 상태를 나타냄
      break;

    case REGISTER_USER:
      return { ...state, register: action.payload }; ///...state는 그냥 위에걸 그대로 가져오는 거고 빈 상태를 나타냄
      break;

    default:
      return state;
  }
}
