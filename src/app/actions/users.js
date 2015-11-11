import { API_BASE_URL } from '../config';

import { USERS_LIST, USERS_CREATE, USERS_UPDATE, USERS_DELETE } from '../constants/actions';

export function handleAPIEvent(event) {
  switch(event.action) {
    case 'create':
      return {type: USERS_CREATE, payload: event.data};
    case 'update':
      return {type: USERS_UPDATE, payload: event.data};
    case 'remove':
      return {type: USERS_DELETE, payload: event.data};
  }
}

export function list_users() {
  return dispatch => {
    console.log("Fetching users");
    fetch(API_BASE_URL + 'api/users')
    .then(response => response.json())
    .then(json => {
      console.log('parsed json', json);
      console.log("Dispatching ajax users");
      dispatch({
        type: USERS_LIST,
        payload: json,
      });
    })
    .catch(err => console.log('parsing failed', err));
  };
}
