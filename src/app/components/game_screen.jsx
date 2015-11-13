const React = require('react');

const Table = require('material-ui/lib/table/table');
const TableBody = require('material-ui/lib/table/table-body');
const TableFooter = require('material-ui/lib/table/table-footer');
const TableHeader = require('material-ui/lib/table/table-header');
const TableHeaderColumn = require('material-ui/lib/table/table-header-column');
const TableRow = require('material-ui/lib/table/table-row');
const TableRowColumn = require('material-ui/lib/table/table-row-column');

import AnswersList from './answers_list';

export default React.createClass({
  render: function () {
  	let divStyle = {
  		fontSize: '20px',
  		padding:'10px',
	  };
    let nextMsg = {
      backgroundColor: 'yellow',
      textAlign: 'center',
    }
    console.log('====> ' + this.props.question.query);
    return (
    	<div>
    	  <h2><i>{this.props.user.name}</i>: {this.props.user.points || 0} pts</h2>
        <div style={nextMsg}>
          {this.props.eta ? `Next question in ${this.props.eta} seconds` : ''}
        </div>
    	  <div style={divStyle}>
    	  	  {this.props.question && this.props.question.query ? this.props.question.query : 'Game will start soon...'}
    	  </div>
    	  <div>
    	  	{this.props.question ? <AnswersList answers={this.props.question.answers} makeGuess={this.props.makeGuess} oldGuess={this.props.oldGuess}/> : ''}
    	  </div>
    	</div>
    );
  },
})
