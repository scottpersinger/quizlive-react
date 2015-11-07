const React = require('react');
const Tabs = require('material-ui/lib/tabs/tabs');
const Tab = require('material-ui/lib/tabs/tab');
const AppBar = require('material-ui/lib/app-bar');
const QuestionList = require('./question_list');
const RaisedButton = require('material-ui/lib/raised-button');
const Dialog = require('material-ui/lib/dialog');
const TextField = require('material-ui/lib/text-field');
const LinkedStateMixin = require('react-addons-linked-state-mixin');

import { create, remove } from '../actions/questions';

const AdminTabs = React.createClass({
  mixins: [LinkedStateMixin],

  getInitialState () {
    return {
    	questions: [{index: 1, id: "1", question:'What is your name?'},
    	{index: 2, id: "2", question:'What is your favorite color?'}],
    	current_question:'',
    	current_index: null,
    };
  },

  componentWillMount() {
  },


  openForm() {
  	this.setState({current_question:''});
  	this.refs.formDialog.show();
  },

  selectItem(questionId) {
  	let q = this.props.questions.find(q => q.id === questionId);
  	if (q) {
  		this.setState({current_question: q.question, current_index: this.props.questions.indexOf(q)});
	  	this.refs.formDialog.show();
  	}
  },

  onDialogSubmit() {
  	console.log(this.state);
  	this.refs.formDialog.dismiss();
  	let index = this.props.questions.reduce(function(prev, cur) {return cur.index > prev.index ? cur : prev}).index+1;
    this.props.dispatch(create(Math.random().toString(), this.state.current_question));
  },

  onDialogDelete() {
    let selectedQuestion = this.props.questions[this.state.current_index];
  	console.log("Deleting ", selectedQuestion);
    this.props.dispatch(remove(selectedQuestion.id));
  	this.refs.formDialog.dismiss();
  },

  render() {
  	  let questionLink = this.linkState('current_question');
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
	        <Tab label="Questions" >
	          <div style={{float:'right'}}>
	            <RaisedButton label="Add Question" secondary={true} onTouchTap={this.openForm} />
	          </div>
	          <h1>Questions</h1>
	          <QuestionList questions={this.props.questions} selectItem={this.selectItem}/>
	        </Tab>
	      </Tabs>

		  <Dialog title={dialogTitle} ref="formDialog" actions={dialogActions}
			  autoDetectWindowHeight={true} autoScrollBodyContent={true}>
			    <div style={{height: '300px'}}>
			    	<TextField hintText="Question" valueLink={questionLink} multiLine={true} fullWidth={true} />
			    	<br />
			    	<TextField hintText="Answers (one per line)" multiLine={true} rows={4} fullWidth={true} />
			    </div>
		  </Dialog>

	    </div>
	  );
  },

});

module.exports = AdminTabs;
