import { API_BASE_URL } from '../config';

import { USERS_LIST } from '../constants/actions';

export function list_users () {
  return dispatch => {
    fetch(API_BASE_URL + 'api/users')
    .then(response => response.json())
    .then(json => {
      console.log('parsed json', json);
      dispatch({
        type: USERS_LIST,
        payload: json,
      });
    })
    .catch(err => console.log('parsing failed', err));
  };
}
