const React = require('react');

// Render the list of answers as selectable buttons
export default React.createClass({
  render: function () {
  	let divStyle = {
  		fontSize: '20px',
  		padding:'10px',
	};
    return (
    	<div>
        <ul>
          {this.props.answers.map(answer => <li key={answer}>{answer}</li>)}
        </ul>
    	</div>
    );
  },
})
