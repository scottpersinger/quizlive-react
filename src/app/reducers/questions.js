import { QUESTION_LIST, QUESTION_CREATE, QUESTION_UPDATE, QUESTION_DELETE } from '../constants/actions'

const initialState = [
  {id: 1, question: 'Who founded America?'},
  {id: 2, question: 'What is the best bread of dog?'},
  {id: 3, question: 'Who is the current Secretary of State?'},
];

export default function users(state = initialState, action) {

  switch (action.type) {
    case QUESTION_LIST:
      return action.payload;

    case QUESTION_CREATE:
      return [...state, action.payload];

    case QUESTION_UPDATE:
      return state; // TODO

    case QUESTION_DELETE:
      return state; // TODO

    default:
      return state;
  }
}
