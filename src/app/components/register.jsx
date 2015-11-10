const React = require('react');
const LinkedStateMixin = require('react-addons-linked-state-mixin');
const TextField = require('material-ui/lib/text-field');
const RaisedButton = require('material-ui/lib/raised-button');
const AppBar = require('material-ui/lib/app-bar');

import { connect } from 'react-redux';
import { login } from '../actions/auth';

const Register = React.createClass({

  mixins: [LinkedStateMixin],

  getInitialState () {
    return {
    	name:'',
    };
  },

  render() {

	  return (
	    <div>
        <h1>New User</h1>
        <div>
          <TextField hintText="Name" valueLink={this.linkState('name')}  />
        </div>

        <RaisedButton label="Register" primary={true} onTouchTap={this._handleTouchTap} />
	    </div>
	  );
  },

  _handleTouchTap() {
  	this.props.dispatch(login(this.state.name));
  },

});

export default connect()(Register);
