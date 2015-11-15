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

  getInitialState: function() {
    return {
      nextEta: null,
      nextIntervalId: null,
      remainingEta: null,
      remainingIntervalId: null,
    };
  },

  componentWillReceiveProps: function(nextProps) {
    if (nextProps.eta > 0) {
      let nextIntervalId = window.setInterval(() => {
        let newEta = this.state.nextEta - 1;
        if (newEta === 0) {
          clearInterval(this.state.nextIntervalId);
          this.setState({nextEta: null, nextIntervalId: null});
        }
        else {
          this.setState({nextEta: newEta});
        }
      }, 1000);
      this.setState({nextEta: nextProps.eta, nextIntervalId: nextIntervalId});
    }
    else
    if (nextProps.question.query && (nextProps.question.query !== this.props.question.query)) {
      // clear question countdown if it still exists
      if (this.state.nextEta) {
        clearInterval(this.state.nextIntervalId);
        this.setState({nextEta: null, nextIntervalId: null});
      }

      let remainingIntervalId = window.setInterval(function () {
        let newEta = this.state.remainingEta - 1;
        console.log("Set new eta to ", newEta);
        if (newEta <= 0 || this.props.oldGuess) {
          clearInterval(remainingIntervalId);
          this.setState({remainingEta: null, remainingIntervalId: null});
        }
        else {
          this.setState({remainingEta: newEta});
        }
      }.bind(this), 1000);
      this.setState({remainingEta: 15, remainingIntervalId: remainingIntervalId});
    }
  },

  render: function () {
  	let divStyle = {
  		fontSize: '20px',
  		padding:'10px',
	  };
    let nextMsg = {
      textAlign: 'center',
      fontSize:'1.5em',
      color:'orange',
    }
    let countDown = {
      textAlign: 'center',
      fontSize:'1.5em',
      color:'black',
    }

    let etaDone = (this.state.remainingEta === null);
    return (
    	<div>
    	  <h2><i>{this.props.user.name}</i>: {this.props.user.points || 0} pts</h2>
        <div style={nextMsg}>
          {this.state.nextEta !== null ? `Next question in ${this.state.nextEta} seconds` : ''}
        </div>
        <div style={countDown}>
          {this.state.remainingEta !== null && !this.props.oldGuess ? this.state.remainingEta + ' secs left to answer' : ''}
        </div>
    	  <div style={divStyle}>
    	  	  {this.props.question && this.props.question.query ? this.props.question.query : 'Game will start soon...'}
    	  </div>
    	  <div>
    	  	{this.props.question ? <AnswersList answers={this.props.question.answers}
                                              makeGuess={this.props.makeGuess}
                                              oldGuess={this.props.oldGuess}
                                              etaDone={etaDone}
                                              answerable={!!this.state.remainingEta} /> : ''}
    	  </div>
    	</div>
    );
  },
})
