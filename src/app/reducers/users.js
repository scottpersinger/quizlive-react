import { USERS_LIST, USERS_CREATE } from '../constants/actions'

const initialState = [
];

export default function users(state = initialState, action) {
  switch (action.type) {
    case USERS_LIST:
      return action.payload.users;

    case USERS_CREATE:
      return [...state, action.payload.user];

    default:
      return state
  }
}
