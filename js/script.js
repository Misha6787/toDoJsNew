/* eslint-disable linebreak-style */
'use strict';

class Todo {
    constructor(form, input, todoList, todoCompleted) {
        this.form = document.querySelector(form);
        this.input = document.querySelector(input);
        this.todoList = document.querySelector(todoList);
        this.todoCompleted = document.querySelector(todoCompleted);
        this.toDoData = new Map(JSON.parse(localStorage.getItem('toDoList')));
    }
    addToStorage() {
        localStorage.setItem('toDoList', JSON.stringify([...this.toDoData]));
    }

    render() {
        this.todoList.textContent = '';
        this.todoCompleted.textContent = '';
        this.toDoData.forEach(this.createItem, this);
        this.addToStorage();
    }
    createItem(todo) {
        const li = document.createElement('li');
        li.classList.add('todo-item');
        li.key = todo.key;
        li.insertAdjacentHTML('beforeend', `
                <span class="text-todo">${todo.value}</span>
				<div class="todo-buttons">
					<button class="todo-remove"></button>
					<button class="todo-complete"></button>
                </div>`
        );
        if (todo.completed) {
            this.todoCompleted.append(li);
        } else {
            this.todoList.append(li);
        }
    }
    addToDo(e) {
        e.preventDefault();
        if (this.input.value.trim()) {
            const newTodo = {
                value: this.input.value,
                completed: false,
                key: this.generateKey()
            };
            this.toDoData.set(newTodo.key, newTodo);
            this.render();
        }
        this.input.value = '';
    }

    generateKey() {
        return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    }

    deleteItem(index) {
        this.toDoData.delete(index);
        this.addToStorage();
        this.render();
    }

    completedItem(index) {
        const falseOnTrue = () => {
            if (this.toDoData.get(index).completed === true) {
                return false;
            } else {
                return true;
            }
        };
        this.toDoData.set(index, {
            key: this.toDoData.get(index).key,
            completed: falseOnTrue(),
            value: this.toDoData.get(index).value
        });
        this.addToStorage();
        this.render();
    }

    handler(event) {
        const target = event.target;
        if (target.classList.contains('todo-remove')) {
            this.toDoData.forEach((item, i) => {
                if (item.key === target.closest('.todo-item').key) {
                    this.deleteItem(i);
                }
            });
        } else if (target.classList.contains('todo-complete')) {
            this.toDoData.forEach((item, i) => {
                if (item.key === target.closest('.todo-item').key) {
                    this.completedItem(i);
                }
            });
        }
    }

    init() {
        this.form.addEventListener('submit', this.addToDo.bind(this));
        window.addEventListener('click', this.handler.bind(this));
        this.render();
    }
}
const todo = new Todo('.todo-control', '.header-input', '.todo-list', '.todo-completed');

todo.init();
