import React from 'react';
import Button from 'react-bootstrap/lib/Button'

class App extends React.Component {
	constructor() {
		super();
		this.state = {};
		this.state.name="rao"
	}
   render() {
      return (
         <div>
	 	Hello
		<Child name={this.state.name} />
         </div>
      );
   }
}

class Child extends React.Component {
   render() {
	return (
		<div>
			<Button bsStyle="success">Default</Button>
		name is {this.props.name}
		</div>
	)
   }
}

export default App;
