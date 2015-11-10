import { QUESTION_LIST, QUESTION_CREATE, QUESTION_UPDATE, QUESTION_DELETE } from '../constants/actions'

import _ from 'lodash'

export default function questions(state = [], action) {

  switch (action.type) {
    case QUESTION_LIST:
      return action.payload;

    case QUESTION_CREATE:
      return [...state, action.payload];

    case QUESTION_UPDATE: {
      let idx = _.findIndex(state, q => q.id === action.payload.id);
      if (idx === -1) {
        return state;
      }
      return [...state.slice(0, idx), action.payload, ...state.slice(idx+1)];
    }

    case QUESTION_DELETE: {
      let idx = _.findIndex(state, q => q.id === action.payload.id);
      if (idx === -1) {
        return state;
      }
      return [...state.slice(0, idx), ...state.slice(idx+1)];
    }

    default:
      return state;
  }
}
