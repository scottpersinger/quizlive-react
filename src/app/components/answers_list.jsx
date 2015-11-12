const React = require('react');

const Table = require('material-ui/lib/table/table');
const TableBody = require('material-ui/lib/table/table-body');
const TableFooter = require('material-ui/lib/table/table-footer');
const TableHeader = require('material-ui/lib/table/table-header');
const TableHeaderColumn = require('material-ui/lib/table/table-header-column');
const TableRow = require('material-ui/lib/table/table-row');
const TableRowColumn = require('material-ui/lib/table/table-row-column');

// Render the list of answers as selectable buttons
export default React.createClass({
  render: function () {
  	let divStyle = {
  		fontSize: '20px',
  		padding:'10px',
  	};

    return (
    	<div>
        <Table selectable={!this.props.oldGuess} onRowSelection={this._handleClick} style={{border: '1px solid #ddd'}}>
          <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
            <TableRow />
          </TableHeader>
          <TableBody displayRowCheckbox={false}>
            {this.props.answers.map((answer, idx) =>
              <TableRow key={idx} style={{backgroundColor: this._getRowStyle(this.props.oldGuess, answer)}} selected={this.props.oldGuess && this.props.oldGuess.answer === answer}>
                return <TableRowColumn>{answer}</TableRowColumn>
              </TableRow>
            )}
          </TableBody>
        </Table>
    	</div>
    );
  },

  _getRowStyle: function(guess, answer) {
    if (guess) {
      if (guess.answer === answer) {
        if (guess.correct) {
          return 'green';
        }
        else {
          return 'red';
        }
      }
      if (guess.correct === answer) {

      }
    }
    else {
      return null;
    }
    return guess && guess.answer === answer ? 'yellow' : null;
  },

  _handleClick: function(rowIdxs) {
    if (this.props.oldGuess) {
      alert('Can only guess once');
      return;
    }
    this.props.makeGuess(this.props.answers[rowIdxs[0]]);
  },

})
