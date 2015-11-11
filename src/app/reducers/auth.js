import { AUTH_LOGIN, AUTH_LOGOUT } from '../constants/actions'

export default function auth(state = {username: localStorage.getItem('username'), token: localStorage.getItem('token')}, action) {
  switch (action.type) {
    case AUTH_LOGIN:
      return {username: action.payload.username, token: action.payload.token}

    case AUTH_LOGOUT:
      return null;

    default:
      return state;
  }
}
