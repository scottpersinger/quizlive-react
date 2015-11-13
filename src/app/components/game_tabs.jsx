const React = require('react');
const Tabs = require('material-ui/lib/tabs/tabs');
const Tab = require('material-ui/lib/tabs/tab');
const AppBar = require('material-ui/lib/app-bar');

import LeaderboardTable from './leaderboard_table';
import GameScreen from './game_screen';

import { list_users } from '../actions/users';
import { get_game } from '../actions/game';
import { propose_answer } from '../actions/guesses';

import { connect } from 'react-redux';

// Select the part of the Redux's global state to inject into the Component as props
function mapStateToProps(state) {
  return {
    users: state.users,
    game: state.game,
    guesses: state.guesses,
  };
}

const GameTabs = React.createClass({

  contextTypes: {
    muiTheme: React.PropTypes.object.isRequired,
  },

  componentWillMount() {
    this.props.dispatch(get_game());
    this.props.dispatch(list_users());
  },

  makeGuess: function(guess) {
    if (this.props.game.question_eta > -10) {
      this.props.dispatch(propose_answer(this.props.game.question.question_id, guess));
    }
  },

  render() {
    if (!this.props.game) {
      return <div />;
    }
	  let user = _.find(this.props.users, u => u.name === this.props.username);
	  console.log("GameTabs props ", this.props);
	  console.log("User is ", user);
	  return (
	    <div>
	      <Tabs>
	        <Tab label="Game" >
            <div style={{padding: this.context.muiTheme.rawTheme.spacing.desktopGutter}}>
  	          <GameScreen question={this.props.game ? this.props.game.question : null}
                          user={user ? user : {}}
                          eta={this.props.game.question_eta}
                          makeGuess={this.makeGuess}
                          oldGuess={this.props.guesses[this.props.game.question.question_id]}/>
            </div>
	        </Tab>
	        <Tab label="Leaderboard" >
            <div style={{padding: this.context.muiTheme.rawTheme.spacing.desktopGutter}}>
              {this.props.users.length > 0 ? <LeaderboardTable users={this.props.users} /> : ''}
            </div>
	        </Tab>
	      </Tabs>

	    </div>
	  );
  },

});

export default connect(
  mapStateToProps
)(GameTabs);
