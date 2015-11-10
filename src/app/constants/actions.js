
/**
 * Action type constants. Should follow the format:
 * <OBJECT ALIAS>_<VERB>
 *
 * For example, an action for fetching a specific "foobar" object:
 * FOOBAR_RETRIEVE
 *
 * Actions verbs should typically use one of the following:
 * LIST                       <- Retrieving a list of objects. (e.g. GET /foobar)
 * CREATE                     <- Creating an object. (e.g. POST /foobar)
 * RETRIEVE                   <- Retrieving an object. (e.g. GET /foobar/:id)
 * UPDATE                     <- Update an existing object. (e.g. PUT /foobar/:id)
 * DESTROY                    <- Deleting an object. (e.g. DELETE /foobar/:id)
 *
 * Some actions types may not have a receiver, which is OK. The result of CREATE, UPDATE, and DELETE actions
 * may enter back into the system through subscriptions rather than in response to API requests.
 */

export const AUTH_LOGIN = 'AUTH_LOGIN';
export const AUTH_LOGOUT = 'AUTH_LOGOUT';

export const USERS_LIST = 'USERS_LIST';
export const USERS_CREATE = 'USERS_CREATE';

export const QUESTION_LIST = 'QUESTION_LIST';
export const QUESTION_CREATE = 'QUESTION_CREATE';
export const QUESTION_UPDATE = 'QUESTION_UPDATE';
export const QUESTION_DELETE = 'QUESTION_DELETE';

export const GAME_LIST = 'GAME_LIST';
export const GAME_UPDATE = 'GAME_UPDATE';

export const GUESS_CREATE = 'GUESS_CREATE';
