export function addTodoAction(key, data) {
		return ({
				type: 'TODO_ADD',
				data: {
					key: key,
					data: data
				}
		});
}

export function removeTodoAction(key) {
		return ({
				type: 'TODO_REMOVE',
				data: {
					key: key 
				}
		});
}
