
import { QUESTION_LIST, QUESTION_CREATE, QUESTION_DELETE } from '../constants/actions';

export function list (username) {
  return {
    type: QUESTION_LIST,
    payload: [],
  };
}

export function create (id, question) {
  return {
    type: QUESTION_CREATE,
    payload: {id, question},
  };
}

export function remove (id) {
  return {
    type: QUESTION_DELETE,
    payload: id,
  };
}
