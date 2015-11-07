import { combineReducers } from 'redux'

import auth from './auth';
import users from './users';
import questions from './questions';
import game from './game';
import guess from './guess';

const rootReducer = combineReducers({
  auth,
  game,
  guess,
  questions,
  users,
})

export default rootReducer
