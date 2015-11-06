const React = require('react');
const List = require('material-ui/lib/lists/list');
const ListItem = require('material-ui/lib/lists/list-item');

const QuestionList = React.createClass({

  getInitialState () {
    return {
    };
  },

  componentWillMount() {
  },

  selectItem(event) {
  	this.props.selectItem(event.currentTarget.id);
  },

  render() {
  	  let that = this;
	  return (
	      <List>
	        {this.props.questions.map(function(q) {
  	          return <ListItem id={q.id} key={q.id} primaryText={q.index + ': ' + q.question} 
  	          			onTouchTap={that.selectItem} />;
	    	})}
	      </List>
	  );
  },

});

module.exports = QuestionList;
