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
	  return (
	    <div>
	      <Tabs>
	        <Tab label="Game" >
	        </Tab>
	        <Tab label="Leaderboard" >
	          (Tab content...)
	        </Tab>
	      </Tabs>

	    </div>
	  );
  },

});

module.exports = GameTabs;
