const express = require("express");
const cors = require("cors"); // verificar pra que serve

const { v4:uuidv4 } = require("uuid"); // criado para usar no id

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
    id: uuidv4(),
    name,
    username,
    todos: [],
  });
  console.log(uuidv4());
  return response.status(201).send();
});

app.get("/todos", checksExistsUserAccount, (request, response) => {
  const {user} = request;
  // passo por parametro abaixo o dados 
  return response.json(user);
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
  return response.status(201).send();
  
});

app.put("/todos/:id", checksExistsUserAccount, (request, response) => { // att total 
  const {title, deadline} = request.body;
  const {user} = request;
  const {id} = request.params;
  const todo =user.todos.find((todo) => todo.id === id);
  if(!todo){
    return response.status(400).json({error:"id not fald"});
  }
  todo.title = title;
  todo.deadline = new Date(deadline);

  return response.status(200).send();
});

app.get("/homework", checksExistsUserAccount, (request,response) =>{
  const {user} = request;
  return response.json(user);
});

app.patch("/todos/:id/done", checksExistsUserAccount, (request, response) => {
  /*const {user} = request;
  
  if(user.id == id)

  user.done = true;
  return response.json(user);*/
});

app.delete("/todos/:username", checksExistsUserAccount, (request, response) => {
  const {user} = request;
  users.splice(user,1)

  return response.status(200).json(users);
});

module.exports = app;
