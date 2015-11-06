/** In this file, we create a React component which incorporates components provided by material-ui */

const React = require('react');
const Dialog = require('material-ui/lib/dialog');
const ThemeManager = require('material-ui/lib/styles/theme-manager');
const LightRawTheme = require('material-ui/lib/styles/raw-themes/light-raw-theme');
const Colors = require('material-ui/lib/styles/colors');
const AppBar = require('material-ui/lib/app-bar');
const GameTabs = require('./game_tabs.jsx'); // Our custom react component
const AdminTabs = require('./admin_tabs.jsx'); // Our custom react component
const Register = require('./register.jsx');

const Main = React.createClass({

  childContextTypes: {
    muiTheme: React.PropTypes.object,
  },

  getInitialState () {
    return {
      muiTheme: ThemeManager.getMuiTheme(LightRawTheme),
      token: localStorage.getItem('token'),
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
    
    this.setState({muiTheme: newMuiTheme, token:this.state.token});
  },

  onRegister(name) {
    localStorage.setItem('token', name);
    this.setState({muiTheme: this.state.muiTheme, token:name})
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
    if (this.state.token === 'admin') {
      mainPage = <AdminTabs user={this.state.token}/>;
    } else if (this.state.token) {
      mainPage = <GameTabs user={this.state.token}/>;
    } else {
      mainPage = <Register onSave={this.onRegister}/>
    }

    return (
      <div style={containerStyle}>
        {mainPage}
      </div>
    );
  },

});

module.exports = Main;
