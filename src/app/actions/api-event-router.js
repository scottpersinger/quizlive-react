import { handleAPIEvent as gameAPIUpdate } from './game';
import { handleAPIEvent as guessAPIUpdate } from './guesses';
import { userAPIUpdate } from './users';
import { handleAPIEvent as questionAPIUpdate } from './questions';

export default function (apiListener, store) {

  apiListener.subscribe('game', data => {
    store.dispatch(gameAPIUpdate(data));
  });

  apiListener.subscribe('question', data => {
    store.dispatch(questionAPIUpdate(data));
  });

  apiListener.subscribe('user', data => {
    store.dispatch(userAPIUpdate(data));
  });

}
