const express = require('express');
const cors = require('cors');

const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  const { username } = request.headers

  const user = users.find( (user) => user.username === username )

  if (!user) {
    return response.status(404).json({ error: 'User Account Not Found!'})
  }

  request.user = user

  return next()
}

app.post('/users', (request, response) => {
 
  const { name, username } = request.body;
  const userAlreadyExists = users.some((users) => users.username === username);

  if (userAlreadyExists) {
    return response.status(400).json({ error: 'Username Is Already Taken!'})
  }

  const user = {
    id: uuidv4(),
    name,
    username,
    todos: []
  }

  users.push(user)

  return response.status(200).json(user);
});

app.get('/todos', checksExistsUserAccount, (request, response) => {
  const { user } = request;

  return response.json(user.todos);
});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  const { title, deadline } = request.body;
  const { user } = request;

  const todosOperation = {
    id: uuidv4(),
    title,
    done: false,
    deadline: new Date(deadline),
    created_at: new Date()
  }

  user.todos.push(todosOperation);

  return response.status(201).json(todosOperation);
});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  const { title, deadline } = request.body;
  const { user } = request;
  const { id } = request.params;

  const todo = user.todos.find( (todo) => todo.id === id)

  if (!todo) {
    return response.status(404).json({ error: 'Todo Does Not Exists!'})
  }

  todo.title = title
  todo.deadline = new Date(deadline)
  
  return response.status(200).json(todo)
});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  const { user } = request;
  const { id } = request.params;

  const todo = user.todos.find( (todo) => todo.id === id)

  if (!todo) {
    return response.status(404).json({ error: 'Todo Does Not Exists!'})
  }
 
  todo.done = true
  return response.status(200).json(todo)

});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  const { user } = request;
  const { id } = request.params;

  const todo = user.todos.find( (todo) => todo.id === id)

  if (!todo) {
    return response.status(404).json({ error: 'Todo Does Not Exists!'})
  }

  user.todos.splice(todo, 1)

  return response.status(204).json()
});

module.exports = app;