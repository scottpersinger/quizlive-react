import { GAME_UPDATE, GAME_LIST } from '../constants/actions'

const initialState = {};

export default function games(state = initialState, action) {
  switch (action.type) {
  	case GAME_LIST:
  		return action.payload;
  		
    case GAME_UPDATE:
      return state;

    default:
      return state;
  }
}
