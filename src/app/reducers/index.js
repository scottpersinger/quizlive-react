import { combineReducers } from 'redux'

import auth from './auth';
import users from './users';
import questions from './questions';
import games from './games';
import guesses from './guesses';

const rootReducer = combineReducers({
  auth:auth,
  games:games,
  guesses,         // ES6 syntax!
  questions,
  users,
})

export default rootReducer
