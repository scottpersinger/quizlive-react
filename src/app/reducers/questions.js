import { QUESTION_LIST, QUESTION_CREATE, QUESTION_UPDATE, QUESTION_DELETE } from '../constants/actions'

import _ from 'lodash'

const initialState = [];
/*
  {id: '1', query: 'Who was the first president of the US?', answers: ['George Washington', 'John Adams', 'Thomas Jefferson'], correct_answer: 'George Washington'},
  {id: '2', query: 'What is the best bread of dog?', answers: ['Yellow Lab', 'Pub', 'Pitbull'], correct_answer: 'Pug'},
  {id: '3', query: 'Who is the current Secretary of State?', answers: ['John Kerry', 'Hillary Clinton', 'Madeleine Albright'], correct_answer: 'John Kerry'},
*/

export default function users(state = initialState, action) {

  switch (action.type) {
    case QUESTION_LIST:
      return action.payload;

    case QUESTION_CREATE:
      return [...state, action.payload];

    case QUESTION_UPDATE: {
      let idx = _.findIndex(state, q => q.id === action.payload.id);
      if (idx === -1) {
        return state;
      }
      return [...state.slice(0, idx), action.payload, ...state.slice(idx+1)];
    }

    case QUESTION_DELETE: {
      let idx = _.findIndex(state, q => q.id === action.payload.id);
      if (idx === -1) {
        return state;
      }
      return [...state.slice(0, idx), ...state.slice(idx+1)];
    }

    default:
      return state;
  }
}
