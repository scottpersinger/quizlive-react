
import { GUESS_CREATE } from '../constants/actions';

export function handleAPIEvent(event) {
  switch(event.action) {
    case 'update':
      return {type: GUESS_CREATE, payload: event.data};
  }
}
