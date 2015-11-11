import { GAME_UPDATE } from '../constants/actions'

const initialState = {};

export default function users(state = initialState, action) {
  switch (action.type) {
    case GAME_UPDATE:
      return state;

    default:
      return state;
  }
}
