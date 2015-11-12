import _ from 'lodash';

import { USERS_LIST, USERS_CREATE, USERS_UPDATE, USERS_DELETE } from '../constants/actions'

function orderByPoints(users) {
  return _.sortBy(users, 'points').reverse();
}

export default function users(state=[], action) {
  switch (action.type) {
    case USERS_LIST:
      return orderByPoints(action.payload);

    case USERS_CREATE:
      return orderByPoints([...state, action.payload]);

    case USERS_UPDATE:
      // replace user record in our store
      let idx = _.findIndex(state, q => q.name === action.payload.name);
      if (idx === -1) {
        return state;
      }
      return orderByPoints([...state.slice(0, idx), action.payload, ...state.slice(idx+1)]);

    case USERS_DELETE:
      idx = _.findIndex(state, q => q.name === action.payload.name);
      if (idx === -1) {
        return state;
      }
      return [...state.slice(0, idx), ...state.slice(idx+1)];

    default:
      return state
  }
}
