const React = require('react');
const Tabs = require('material-ui/lib/tabs/tabs');
const Tab = require('material-ui/lib/tabs/tab');
const AppBar = require('material-ui/lib/app-bar');

import { connect } from 'react-redux';

// Select the part of the Redux's global state to inject into the Component as props
function mapStateToProps(state) {
  return {
    username: state.auth,
  };
}

const GameTabs = React.createClass({

  getInitialState () {
    return {
    };
  },

  componentWillMount() {
  },


  render() {
	  return (
	    <div>
	      <Tabs>
	        <Tab label="Game" >
	        </Tab>
	        <Tab label="Leaderboard" >
	          (Tab content...)
	        </Tab>
	      </Tabs>

	    </div>
	  );
  },

});

export default connect(
  mapStateToProps
)(GameTabs);
