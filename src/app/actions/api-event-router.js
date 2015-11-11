import { handleAPIEvent as gameAPIUpdate } from './game';
import { handleAPIEvent as guessAPIUpdate } from './guesses';
import { handleAPIEvent as userAPIUpdate } from './users';
import { handleAPIEvent as questionAPIUpdate } from './questions';

export default function (apiListener, store) {

  apiListener.subscribe('game', data => {
    store.dispatch(gameAPIUpdate(data));
  });

  apiListener.subscribe('guess', data => {
    store.dispatch(guessAPIUpdate(data));
  });

  apiListener.subscribe('question', data => {
    store.dispatch(questionAPIUpdate(data));
  });

  apiListener.subscribe('user', data => {
    store.dispatch(userAPIUpdate(data));
  });

}
