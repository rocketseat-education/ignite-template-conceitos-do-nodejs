const express = require("express");
const cors = require("cors"); // verificar pra que serve

const { v4:uuidv4 } = require("uuid"); // criado para usar no id

const app = express();

//app.use(cors());
app.use(express.json());

const users = []; // array de usuers

/* ===============================================================================/*
/*                                 Funcoes aux
/* ===============================================================================*/


// funcao midllewares
function checksExistsUserAccount(request, response, next) {
  
  const { username } = request.headers;

  const user = users.find((user) => user.username === username);

  if (!user) {
    return response.status(404).json({ error: "User not fald!" });
  }

  request.user = user; // criei var referente ao middle
  return next();
}


/* ===============================================================================/*
/*                                  Http Responses
/* ===============================================================================*/

app.post("/users", (request, response) => {
  const { name, username } = request.body; // recebendo dados do user
  const userAlreadyExists = users.some((users) => users.username === username);

  if (userAlreadyExists) {
    return response.status(400).json({Error: "User already exits!"});
  }
  const user = {
    id: uuidv4(),
    name,
    username,
    todos: [],
  };

  users.push(user);
  return response.status(201).json(user); // foi aceito no test automatizado
});

app.get("/todos", checksExistsUserAccount, (request, response) => {
  const {user} = request;
  // passo por parametro abaixo o dados 
  return response.json(user.todos);
});

app.post("/todos", checksExistsUserAccount, (request, response) => {
  const {user} = request;
  const {title,deadline} = request.body;
  
  // crio object para ser anexado no object pertecente ao user 
  const todosOperation = {
    id: uuidv4(),
    title,
    done: false,
    deadline: new Date(deadline),
    created_at: new Date()
  };

  user.todos.push(todosOperation);
  return response.status(201).json(todosOperation);
  
});

app.put("/todos/:id", checksExistsUserAccount, (request, response) => { // att total 
  const {title, deadline} = request.body;
  const {user} = request;
  const {id} = request.params;
  const todo =user.todos.find((todo) => todo.id === id);
  if(!todo){
    return response.status(404).json({error:"id not fald"});
  }
  todo.title = title;
  todo.deadline = new Date(deadline);

  return response.status(200).json(todo);
});

app.patch("/todos/:id/done", checksExistsUserAccount, (request, response) => {
  const {user} = request;
  const {id} = request.params;

  const todo = user.todos.find((todo) => todo.id === id);
  if(!todo){
    return response.status(404).json({error:"not fald!"});
  }

  todo.done = true;
  return response.status(200).json(todo);
});

app.delete("/todos/:id", checksExistsUserAccount, (request, response) => {
  const {user} = request;
  const {id} = request.params;

  const todo = user.todos.find((todo) => todo.id === id);
  if(!todo){
    return response.status(404).json({error:"not fald!"});
  }
  user.todos = user.todos.filter((todo) => todo.id !== id);
  return response.status(204).send();
});

module.exports = app;
