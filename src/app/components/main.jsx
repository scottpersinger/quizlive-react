/** In this file, we create a React component which incorporates components provided by material-ui */

const React = require('react');
const Dialog = require('material-ui/lib/dialog');
const ThemeManager = require('material-ui/lib/styles/theme-manager');
const LightRawTheme = require('material-ui/lib/styles/raw-themes/light-raw-theme');
const Colors = require('material-ui/lib/styles/colors');
const AppBar = require('material-ui/lib/app-bar');
const LeftNav = require('material-ui/lib/left-nav');
const MenuItem = require('material-ui/lib/menu/menu-item');
const GameTabs = require('./game_tabs.jsx'); // Our custom react component
const AdminTabs = require('./admin_tabs.jsx'); // Our custom react component
const Register = require('./register.jsx');

import { connect } from 'react-redux';
import { login, logout } from '../actions/auth';

const menuItems = [
  { route: 'logout', text: 'Logout' },
];

// Which part of the Redux global state does our component want to receive as props?
function mapStateToProps(state) {
  return {
    username: state.auth,
  };
}

// Which action creators does it want to receive by props?
function mapDispatchToProps(dispatch) {
  return {
    login: (username) => dispatch(login(username)),
    logout: () => dispatch(logout()),
  }
}

const Main = React.createClass({

  childContextTypes: {
    muiTheme: React.PropTypes.object,
  },

  getInitialState () {
    return {
      muiTheme: ThemeManager.getMuiTheme(LightRawTheme),
    };
  },

  getChildContext() {
    return {
      muiTheme: this.state.muiTheme,
    };
  },

  componentWillMount() {
    let newMuiTheme = ThemeManager.modifyRawThemePalette(this.state.muiTheme, {
      accent1Color: Colors.deepOrange500,
    });
  },

  onRegister(name) {
    this.props.login(name);
  },

  render() {

    let containerStyle = {
      textAlign: 'center',
      paddingTop: '0px',
    };

    let standardActions = [
      { text: 'Okay' },
    ];

    let mainPage = null;
    let title = null;
    if (this.props.username === 'admin') {
      mainPage = <AdminTabs user={this.props.username}/>;
      title = "Quiz Admin (" + this.props.username + ")";
    } else if (this.props.username) {
      mainPage = <GameTabs user={this.props.username}/>;
      title = "QuizLive (" + this.props.username + ")";
    } else {
      mainPage = <Register onSave={this.onRegister}/>
      title = "Quiz Live";
    }

    return (
      <div style={containerStyle}>
        <AppBar
          title={title}
          iconClassNameRight="muidocs-icon-navigation-expand-more"
          onLeftIconButtonTouchTap={this._handleLeftIconTouchTap} />
        <LeftNav ref="leftNav" docked={false} menuItems={menuItems} onChange={this._handleLeftNavTouchTap }/>
        {mainPage}
      </div>
    );
  },

  _handleLeftIconTouchTap(e) {
    e.preventDefault();
    this.refs.leftNav.toggle();
  },

  _handleLeftNavTouchTap(e) {
    this.props.logout();
  },

});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Main)
