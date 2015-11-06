var keyMirror = require('react/lib/keyMirror');

/**
 * Action type constants. Should follow the format:
 * <OBJECT ALIAS>_<VERB>
 *
 * For example, an action for fetching a specific "Mapping" object:
 * MAPPING_RETRIEVE
 *
 * Actions verbs should typically use one of the following:
 * LIST                       <- Retrieving a list of objects. (e.g. GET /mappings)
 * CREATE                     <- Creating an object. (e.g. POST /mappings)
 * RETRIEVE                   <- Retrieving an object. (e.g. GET /mappings/:id)
 * UPDATE                     <- Update an existing object. (e.g. PUT /mappings/:id)
 * DESTROY                    <- Deleting an object. (e.g. DELETE /mappings/:id)
 *
 * Some actions types may not have a receiver, which is OK. The result of CREATE, UPDATE, and DELETE actions
 * may enter back into the system through subscriptions rather than in response to API requests.
 */

module.exports = keyMirror({

  // connection actions
  QUESTION_LIST: null,
  QUESTION_CREATE: null,
  QUESTION_UPDATE: null,
  QUESTION_DELETE: null
});
