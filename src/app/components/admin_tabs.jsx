const React = require('react');
const Tabs = require('material-ui/lib/tabs/tabs');
const Tab = require('material-ui/lib/tabs/tab');
const AppBar = require('material-ui/lib/app-bar');
const QuestionList = require('./question_list');
const RaisedButton = require('material-ui/lib/raised-button');
const Dialog = require('material-ui/lib/dialog');
const TextField = require('material-ui/lib/text-field');
const LinkedStateMixin = require('react-addons-linked-state-mixin');
import LeaderboardTable from './leaderboard_table';

import { connect } from 'react-redux';

import { list, create, update, remove } from '../actions/questions';
import { get_game, next_question, create_game, reset_game } from '../actions/game';
import { list_users } from '../actions/users';

// Select the part of the Redux's global state to inject into the Component as props
function mapStateToProps(state) {
  return {
    questions: state.questions,
    game: state.games,
    users: state.users,
  };
}

const AdminTabs = React.createClass({
  mixins: [LinkedStateMixin],

  contextTypes: {
    muiTheme: React.PropTypes.object.isRequired,
  },

  getInitialState () {
    return {
    	current_question:'',
      current_answers: '',
      current_correct_answer: '',
    	current_id: null,
      game: null,
    };
  },

  componentWillMount() {
    this.props.dispatch(list());
    this.props.dispatch(get_game());
    this.props.dispatch(list_users());
  },

  componentDidMount() {

  },

  openForm() {
  	this.setState({current_question:'', current_answers: '', current_correct_answer: '', current_id: null});
  	this.refs.formDialog.show();
  },

  selectItem(questionId) {
  	let q = this.props.questions.find(q => q.id === questionId);
  	if (q) {
  		this.setState({
        current_question: q.query,
        current_answers: q.answers ? q.answers.join('\n') : '',
        current_correct_answer: q.correct_answer,
        current_id: q.id,
      });
	  	this.refs.formDialog.show();
  	}
  },

  onDialogSubmit() {
  	this.refs.formDialog.dismiss();
    if (this.state.current_id !== null) {
      this.props.dispatch(update(this.state.current_id, this.state.current_question, this.state.current_answers.split('\n'), this.state.current_correct_answer));
    }
    else {
      this.props.dispatch(create(this.state.current_question, this.state.current_answers.split('\n'), this.state.current_correct_answer));
    }
  },

  onDialogDelete() {
    this.props.dispatch(remove(this.state.current_id));
  	this.refs.formDialog.dismiss();
  },

  showNextQuestion() {
    this.props.dispatch(next_question(this.props.game.id, this.props.game.current_question_index, this.props.token));
  },

  resetGame() {
    this.props.dispatch(reset_game(this.props.game.id, this.props.token));
  },

  createGame() {
    this.props.dispatch(create_game(this.props.token));
  },

  render() {
	  let dialogActions = [
  		{ text: 'Cancel' },
  		{ text: 'Submit', onTouchTap: this.onDialogSubmit, ref: 'submit' },
	  ];
	  let dialogTitle = this.state.current_question ? 'Edit Question' : 'New Question';
	  if (this.state.current_question) {
	  	dialogActions.unshift({text:'Delete', onTouchTap: this.onDialogDelete});
	  }
    console.log(this.props);

    let game_question = '';
    let game_query = '';
    if (this.props.game && this.props.game.current_question_index != null && this.props.game.current_question_index >= 0) {
      game_question = this.props.questions[this.props.game.current_question_index];
      if (game_question) {
        game_query = game_question.query;
      }
    }
	  return (
	    <div>
	      <Tabs>
	        <Tab label="Game">
            <div style={{padding: this.context.muiTheme.rawTheme.spacing.desktopGutter}}>
              {this.props.game ?
                <div>
                  <h1>Current Game</h1>
                  <h2>Question {this.props.game.current_question_index+1} of {this.props.game.total_questions}</h2>
                  <h3><i>"{game_query}"</i></h3>
                  <RaisedButton label="Next Question" primary={true} onTouchTap={this.showNextQuestion} />
                  <div>
                    <br />
                    <a href='#' onClick={this.resetGame}>Reset Game</a>
                  </div>
                  <h2>Leaderboard</h2>
                  {this.props.users.length > 0 ? <LeaderboardTable users={this.props.users} /> : ''}
                </div>
                :
                <div>
                  No game exists yet
                  <br />
                  <a href='#' onClick={this.createGame}>Create Game</a>
                </div>
              }

            </div>
	        </Tab>
	        <Tab label="Questions">
            <div style={{padding: this.context.muiTheme.rawTheme.spacing.desktopGutter}}>
  	          <div style={{float:'right'}}>
  	            <RaisedButton label="Add Question" secondary={true} onTouchTap={this.openForm} />
  	          </div>
  	          <h1>Questions</h1>
  	          <QuestionList questions={this.props.questions} selectItem={this.selectItem}/>
            </div>
	        </Tab>
	      </Tabs>

		  <Dialog title={dialogTitle} ref="formDialog" actions={dialogActions}
			  autoDetectWindowHeight={true} autoScrollBodyContent={true}>
			    <div style={{height: '300px'}}>
			    	<TextField hintText="Question" valueLink={this.linkState('current_question')} multiLine={false} fullWidth={true} />
			    	<br />
			    	<TextField hintText="Answers (one per line)" valueLink={this.linkState('current_answers')} multiLine={true} rows={4} fullWidth={true} />
            <br />
            <TextField hintText="Correct Answer" valueLink={this.linkState('current_correct_answer')} multiLine={false} fullWidth={true} />
			    </div>
		  </Dialog>

	    </div>
	  );
  },

});

export default connect(
  mapStateToProps
)(AdminTabs);
