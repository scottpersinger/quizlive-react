
import { AUTH_LOGIN, AUTH_LOGOUT } from '../constants/actions';

export function login (username) {
  localStorage.setItem('token', username);
  return {
    type: AUTH_LOGIN,
    payload: {
      username: username,
    },
  };
}

export function logout () {
  localStorage.removeItem('token');
  return {
    type: AUTH_LOGOUT,
  };
}
