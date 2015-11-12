
import { API_BASE_URL } from '../config';

import { GUESS_CREATE } from '../constants/actions';

export function handleAPIEvent(event) {
  switch(event.action) {
    case 'create':
      return {type: GUESS_CREATE, payload: event.data};
  }
}

export function propose_answer(question_id, answer) {
  console.log(`question_id: ${question_id}, answer: ${answer}`);
  return (dispatch, getState) => {
    fetch(API_BASE_URL + 'api/guesses', {
      method: 'post',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_id: getState().auth.username,
        answer: answer,
        question_id: question_id,
      }),
    })
    .then(response => {
      if (response.status === 403) {
        throw new Error('You have already answered that question');
      }
      else {
        return response.json();
      }
    })
    .then(json => {
      dispatch({
        type: GUESS_CREATE,
        payload: {question_id, answer, ...json},
      });
    })
    .catch(err => alert(err.message));
  };

}
