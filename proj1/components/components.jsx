import React from 'react';
import { addTodoAction } from '../actions/actions.js'
import {removeTodoAction} from '../actions/actions.js'

export class CmdBox extends React.Component {
	render() {
		return (
			<div>
				<textarea ref="myText" name="cmdbox" placeholder="Enter command"/>
				<button onClick={() => {
						let text = this.refs.myText.value;
						this.refs.myText.value = '';
						let cmd = text.substr(0, text.indexOf(" "));
						text = text.substr(text.indexOf(" ") + 1);
						if (cmd == "add") {
							this.props.dispatch(addTodoAction(Date.now(), text));
						} else if (cmd == "remove") {
							let action = removeTodoAction(parseInt(text));
							this.props.dispatch(action);
						}
					}}>
					Enter
				</button>
			</div>
		);
	}
}

class Todo extends React.Component {
	render() {
		return (
			<div>
				{this.props.myId} {this.props.data}
			</div>
		)
	}
}

export class TodoWindow extends React.Component {
	render() {
		let todos = this.props.todos;
		return (
			<div>
				{todos.map((todo)=><Todo key={todo.key} myId={todo.key} data={todo.data}/>)} 
			</div>
		)
	}
}
