
import { GAME_UPDATE } from '../constants/actions';

export function handleAPIEvent(event) {
  switch(event.action) {
    case 'update':
      return {type: GAME_UPDATE, payload: event.data};
  }
}
