
import { API_BASE_URL } from '../config';

import { QUESTION_LIST, QUESTION_CREATE, QUESTION_UPDATE, QUESTION_DELETE } from '../constants/actions';

export function handleAPIEvent(event) {
  switch(event.action) {
    case 'create':
      return {type: QUESTION_CREATE, payload: event.data};
    case 'update':
      return {type: QUESTION_UPDATE, payload: event.data};
    case 'remove':
      return {type: QUESTION_DELETE, payload: event.data};
  }
}


export function list () {
  return dispatch => {
    fetch(API_BASE_URL + 'api/questions')
    .then(response => response.json())
    .then(json => {
      console.log('parsed json', json);
      dispatch({
        type: QUESTION_LIST,
        payload: json,
      });
    })
    .catch(err => console.log('parsing failed', err));
  };
}

export function create (query, answers, correctAnswer) {
  return dispatch => {
    fetch(API_BASE_URL + 'api/questions', {
      method: 'post',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: query,
        answers: answers,
        correct_answer: correctAnswer,
      }),
    })
    .then(response => response.json())
    .then(json => {
      dispatch({
        type: QUESTION_CREATE,
        payload: json,
      });
    })
    .catch(err => console.log('parsing failed', err));
  };
}

export function update (id, query, answers, correctAnswer) {
  return dispatch => {
    fetch(API_BASE_URL + 'api/questions/' + id, {
      method: 'put',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: query,
        answers: answers,
        correct_answer: correctAnswer,
      }),
    })
    .then(response => response.json())
    .then(json => {
      dispatch({
        type: QUESTION_UPDATE,
        payload: json,
      });
    })
    .catch(err => console.log('parsing failed', err));
  };
}

export function remove (id) {
  return dispatch => {
    fetch(API_BASE_URL + 'api/questions/' + id, {
      method: 'delete',
    })
    .then(response => {
      dispatch({
        type: QUESTION_DELETE,
        payload: {id},
      });
    })
    .catch(err => console.log('parsing failed', err));
  };
}
