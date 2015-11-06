const React = require('react');
const Tabs = require('material-ui/lib/tabs/tabs');
const Tab = require('material-ui/lib/tabs/tab');
const AppBar = require('material-ui/lib/app-bar');

const GameTabs = React.createClass({

  getInitialState () {
    return {
    };
  },

  componentWillMount() {
  },


  render() {
  	  let title = "QuizLive (" + this.props.user + ")"; 
	  return (
	    <div>
	      <AppBar
	        title={title}
	        iconClassNameRight="muidocs-icon-navigation-expand-more" />
	    
	      <Tabs>
	        <Tab label="Item One" >
	        </Tab>
	        <Tab label="Item Two" >
	          (Tab content...)
	        </Tab>
	        <Tab
	          label="Item Three"
	          route="home"
	          onActive={this._handleTabActive} />
	      </Tabs>

	    </div>
	  );
  },

});

module.exports = GameTabs;
