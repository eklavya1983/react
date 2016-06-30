import React from 'react';
import ReactDOM from 'react-dom'
import App from './App.jsx'
import { createStore } from 'redux'
import {Provider} from 'react-redux'


function addToDo(todos, item) {
	return [item, ...todos];
}

function removeToDo(todos, item) {
	return todos.filter((todo) => { return todo.key != item.key } );
}

function applyAction(state, action) {
	switch (action.type) {
		case 'TODO_ADD':
			return Object.assign(
				{},
				state,
				{todos: addToDo(state.todos, action.data)});
		case 'TODO_REMOVE':
			return Object.assign(
				{},
				state,
				{todos: removeToDo(state.todos, action.data)});
		default:
			console.log("unknown type: ${action.type}");
			return state;
	}
}

let initialState = {
	todos : []
};
const store = createStore(applyAction, initialState);

function render() {
	ReactDOM.render(
		<Provider store={store}><App></App></Provider>,
		document.getElementById('app'));
}

function logState() {
	console.log("State:");
	console.log(store.getState());
}

render();
store.subscribe(logState);
