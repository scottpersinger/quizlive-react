import { USERS_LIST, USERS_CREATE, USERS_UPDATE, USERS_DELETE } from '../constants/actions'

export default function users(state=[], action) {
  switch (action.type) {
    case USERS_LIST:
      return action.payload;

    case USERS_CREATE:
      return [...state, action.payload];

    case USERS_UPDATE:
      // replace user record in our store
      let idx = _.findIndex(state, q => q.id === action.payload.user);
      if (idx === -1) {
        return state;
      }
      return [...state.slice(0, idx), action.payload, ...state.slice(idx+1)];

    case USERS_DELETE:
      idx = _.findIndex(state, q => q.id === action.payload.user);
      if (idx === -1) {
        return state;
      }
      return [...state.slice(0, idx), ...state.slice(idx+1)];

    default:
      return state
  }
}
