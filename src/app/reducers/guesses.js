import { AUTH_LOGIN, GUESS_CREATE, GAME_CREATE } from '../constants/actions'

export default function guesses(state={}, action) {
  switch (action.type) {
    // reset all guesses on login
    case AUTH_LOGIN:
      return {};

    // reset all guesses on game create
    case GAME_CREATE:
      return {};

    case GUESS_CREATE:
      return {...state, [action.payload.question_id]: action.payload};

    default:
      return state;
  }
}
