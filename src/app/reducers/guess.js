import { GUESS_CREATE } from '../constants/actions'

const initialState = {};

export default function users(state = initialState, action) {
  switch (action.type) {
    case GUESS_CREATE:
      return state;

    default:
      return state;
  }
}
