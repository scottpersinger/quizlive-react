import { API_BASE_URL } from '../config';

import { GAME_LIST } from '../constants/actions';

export function get_game () {
  return dispatch => {
    fetch(API_BASE_URL + 'api/game')
    .then(response => response.json())
    .then(json => {
      dispatch({
        type: GAME_LIST,
        payload: json,
      });
    })
    .catch(err => console.log('parsing failed', err));
  };
}

export function next_question (game_id, index, admin_token) {
  index = index+1;
  return dispatch => {
    fetch(API_BASE_URL + 'api/game', 
      {method:'put', 
      body: JSON.stringify({id:game_id, current_question_index:index}),
      headers: {
        'Authorization':admin_token,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    })
    .then(response => response.json())
    .then(json => {
      dispatch({
        type: GAME_LIST,
        payload: json,
      });
    })
    .catch(err => console.log('parsing failed', err));
  };
}

export function reset_game (game_id, admin_token) {
  return dispatch => {
    fetch(API_BASE_URL + 'api/game', 
      {method:'put', 
      body: JSON.stringify({id:game_id, current_question_index:-1}),
      headers: {
        'Authorization':admin_token,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    })
    .then(response => response.json())
    .then(json => {
      dispatch({
        type: GAME_LIST,
        payload: json,
      });
    })
    .catch(err => console.log('parsing failed', err));
  };
}
