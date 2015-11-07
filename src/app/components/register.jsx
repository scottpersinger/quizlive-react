const React = require('react');
const TextField = require('material-ui/lib/text-field');
const RaisedButton = require('material-ui/lib/raised-button');
const AppBar = require('material-ui/lib/app-bar');

const Register = React.createClass({

  getInitialState () {
    return {
    	name:'',
    };
  },

  componentWillMount() {
  },

  _nameChange: function(event) {
    this.setState({name: event.target.value});
  },

  render() {

	  return (
	    <div>
        <h1>New User</h1>
        <div>
          <TextField hintText="Name" onChange={this._nameChange}/>
        </div>

        <RaisedButton label="Register" primary={true} onTouchTap={this._handleTouchTap} />
	    </div>
	  );
  },

  _handleTouchTap() {
  	this.props.onSave(this.state.name);
  },


});

module.exports = Register;
