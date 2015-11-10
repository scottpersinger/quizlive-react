const React = require('react');
const Tabs = require('material-ui/lib/tabs/tabs');
const Tab = require('material-ui/lib/tabs/tab');
const AppBar = require('material-ui/lib/app-bar');

import LeaderboardTable from './leaderboard_table';

import { list } from '../actions/users';

import { connect } from 'react-redux';

// Select the part of the Redux's global state to inject into the Component as props
function mapStateToProps(state) {
  return {
    users: state.users,
  };
}

const GameTabs = React.createClass({

  componentWillMount() {
    this.props.dispatch(list());
  },

  render() {
	  return (
	    <div>
	      <Tabs>
	        <Tab label="Game" >
	        </Tab>
	        <Tab label="Leaderboard" >
            {this.props.users.length > 0 ? <LeaderboardTable users={this.props.users} /> : ''}
	        </Tab>
	      </Tabs>

	    </div>
	  );
  },

});

export default connect(
  mapStateToProps
)(GameTabs);
