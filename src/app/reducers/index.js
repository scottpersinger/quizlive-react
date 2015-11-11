import { combineReducers } from 'redux'

import auth from './auth';
import users from './users';
import questions from './questions';
import game from './game';
import guesses from './guesses';

const rootReducer = combineReducers({
  auth:auth,
  game:game,
  guesses,         // ES6 syntax!
  questions,
  users,
})

export default rootReducer
