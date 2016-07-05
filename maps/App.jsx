import React from 'react';
import Button from 'react-bootstrap/lib/Button'
import {connect} from 'react-redux'
import {TodoWindow, CmdBox} from './components/components.jsx'


const DisplayWindowF = (props) => {
	return (
		<TodoWindow todos={props.todos}/>
	)
}

function mapStateToProps(state) {
	return { todos: state.todos }
}
const DisplayWindow = connect(mapStateToProps)(DisplayWindowF)
const CmdBoxC = connect()(CmdBox)


class App extends React.Component {
	constructor() {
		super();
		this.state = {};
	}
	render() {
		return (
			<div>
				<DisplayWindow/>
				<CmdBoxC/>
			</div>
		);
	}
}

export default App;
