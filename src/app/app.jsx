(function () {
  require("babel-polyfill");
  require('whatwg-fetch');

  let React = require('react');
  let ReactDOM = require('react-dom');
  let injectTapEventPlugin = require('react-tap-event-plugin');
  let Main = require('./components/main.jsx'); // Our custom react component

  let Provider = require('react-redux').Provider;

  //Needed for React Developer Tools
  window.React = React;

  //Needed for onTouchTap
  //Can go away when react 1.0 release
  //Check this repo:
  //https://github.com/zilverline/react-tap-event-plugin
  injectTapEventPlugin();

  // create redux store
  const configureStore = require('./store/configureStore');
  const store = configureStore();

  // setup api event listener and router to actions
  let apiEventListener = require('./services/api-events')();
  let apiEventRouter = require('./actions/api-event-router');
  apiEventRouter(apiEventListener, store);

  // Render the main app react component into the app div.
  // For more details see: https://facebook.github.io/react/docs/top-level-api.html#react.render
  ReactDOM.render(<Provider store={store}><Main /></Provider>, document.getElementById('app'));

})();
