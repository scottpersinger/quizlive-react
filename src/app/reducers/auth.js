import { AUTH_LOGIN, AUTH_LOGOUT } from '../constants/actions'

export default function users(state = null, action) {
  switch (action.type) {
    case AUTH_LOGIN:
      return action.payload.username

    case AUTH_LOGOUT:
      return null;

    default:
      return state;
  }
}
