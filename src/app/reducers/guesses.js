import { AUTH_LOGIN, GUESS_CREATE } from '../constants/actions'

export default function guesses(state={}, action) {
  switch (action.type) {
    case AUTH_LOGIN:
      return {};
      
    case GUESS_CREATE:
      return {...state, [action.payload.question_id]: action.payload};

    default:
      return state;
  }
}
