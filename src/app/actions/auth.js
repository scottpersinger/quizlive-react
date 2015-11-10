
import { API_BASE_URL } from '../config';

import { AUTH_LOGIN, AUTH_LOGOUT, USERS_CREATE, USERS_DELETE } from '../constants/actions';

export function login (username) {
  return dispatch => {
    fetch(API_BASE_URL + 'api/users', {
      method: 'post',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: username,
      }),
    })
    .then(response => {
      if (response.status >= 200 && response.status < 300) {
        return response.json();
      }
      else
      if (response.status === 403) {
        throw(new Error('That user already exists.  Please pick a different username'));
      }
      else {
        throw(new Error(response.statusText))
      }
    })
    .then(json => {
      localStorage.setItem('username', username);
      dispatch({
        type: AUTH_LOGIN,
        payload: {
          username: username,
        },
      });
      dispatch({
        type: USERS_CREATE,
        payload: json,
      });
    })
    .catch(err => alert('Error: ' + err.message));
  };

}

export function logout () {
  return dispatch => {
    let username = localStorage.getItem('username');
    fetch(API_BASE_URL + 'api/users/' + encodeURIComponent(username), {
      method: 'delete',
    })
    .then(response => {
      localStorage.removeItem('username');
      dispatch({
        type: AUTH_LOGOUT,
      });
      dispatch({
        type: USERS_DELETE,
        payload: {name: username},
      });
    })
    .catch(err => console.log('parsing failed', err));
  };

}
