const React = require('react');
const Tabs = require('material-ui/lib/tabs/tabs');
const Tab = require('material-ui/lib/tabs/tab');
const AppBar = require('material-ui/lib/app-bar');

import LeaderboardTable from './leaderboard_table';
import GameScreen from './game_screen';

import { list_users } from '../actions/users';
import { get_game } from '../actions/game';

import { connect } from 'react-redux';

// Select the part of the Redux's global state to inject into the Component as props
function mapStateToProps(state) {
  return {
    users: state.users,
    game: state.games,
  };
}

const GameTabs = React.createClass({

  componentWillMount() {
    this.props.dispatch(get_game());
    this.props.dispatch(list_users());
  },

  render() {
	  let user = _.find(this.props.users, u => u.name === this.props.username);
	  console.log("GameTabs props ", this.props);
	  console.log("User is ", user);
	  return (
	    <div>
	      <Tabs>
	        <Tab label="Game" >
	          {<GameScreen question={this.props.game ? this.props.game.question : null} user={user ? user : {}} />}
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
