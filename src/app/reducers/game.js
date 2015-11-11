import { GAME_LIST, GAME_CREATE, GAME_UPDATE } from '../constants/actions'

export default function users(state=null, action) {
  switch (action.type) {
  	case GAME_LIST:
    case GAME_CREATE:
    case GAME_UPDATE:
      return action.payload;

    default:
      return state;
  }
}
