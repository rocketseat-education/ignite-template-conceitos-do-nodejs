const express = require("express");
const cors = require("cors"); // verificar pra que serve

const { v4: uuidv4 } = require("uuid"); // criado para usar no id

const app = express();

app.use(cors());
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
    return response.status(400).json({ error: "User not fald!" });
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
  users.push({
    id: uuidv4,
    name,
    username,
    todos: [],
  });
  return response.status(201).send();
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
    id: uuidv4,
    title,
    done: false,
    deadline: new Date(deadline),
    created_at: new Date()
  };

  user.todos.push(todosOperation);
  return response.status(201).send();
  
});

app.put("/todos/:id", checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

app.patch("/todos/:id/done", checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

app.delete("/todos/:id", checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

module.exports = app;
