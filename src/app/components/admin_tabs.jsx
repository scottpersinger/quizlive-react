const React = require('react');
const Tabs = require('material-ui/lib/tabs/tabs');
const Tab = require('material-ui/lib/tabs/tab');
const AppBar = require('material-ui/lib/app-bar');
const QuestionList = require('./question_list');
const RaisedButton = require('material-ui/lib/raised-button');
const Dialog = require('material-ui/lib/dialog');
const TextField = require('material-ui/lib/text-field');
const LinkedStateMixin = require('react-addons-linked-state-mixin');

import { connect } from 'react-redux';

import { list, create, update, remove } from '../actions/questions';

// Select the part of the Redux's global state to inject into the Component as props
function mapStateToProps(state) {
  return {
    username: state.auth,
    questions: state.questions,
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
    };
  },

  componentWillMount() {
    this.props.dispatch(list());
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

  render() {
	  let dialogActions = [
  		{ text: 'Cancel' },
  		{ text: 'Submit', onTouchTap: this.onDialogSubmit, ref: 'submit' },
	  ];
	  let dialogTitle = this.state.current_question ? 'Edit Question' : 'New Question';
	  if (this.state.current_question) {
	  	dialogActions.unshift({text:'Delete', onTouchTap: this.onDialogDelete});
	  }

	  return (
	    <div>
	      <Tabs>
	        <Tab label="Game" >
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
