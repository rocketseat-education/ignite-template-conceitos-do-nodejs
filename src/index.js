const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  // Complete aqui
  const { username } = request.header;
  const user = users.find((user) => user.username === username );
  if(!user){
        return response.status(400).json(
            { error: "Username not found" }) ;
  } 
  request.user = user
  next();
}

app.get("/", (request, response) =>{
  response.json("Todo List").status(200);
});

app.post('/users', (request, response) => {
  // Complete aqui
  const {name, username} = request.body;
  const userAlreadyExists = users.some(
      (user) => user.username === username
  );
  if(usernameAlreadyExists){
      return response.status(400).json({ error: "Username already exists" }) 
  }
  const user = {
    id: uuidv4,
    name,
    username,
    todos: [] 
  };
  users.push(user)
  return response.status(201).json(users);  
});

app.get('/todos', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { username } = request.headers;
  return response.status(200).json(username.todos)
});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const {title, deadline} = req.body;
  const {user}  = request;
  const todosOperation = {
      id: uuidv4, 
      title,
      done: false, 
      deadline,
      created_at: new Date()
  }
});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { user } = request;
  user.splice(user, 1)
  return response.status(204).json(users)

});

module.exports = app;