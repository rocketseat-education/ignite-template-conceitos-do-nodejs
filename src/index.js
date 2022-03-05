const express = require("express");
const cors = require("cors");

const { v4: uuidv4 } = require("uuid");

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  const { username } = request.headers;

  const user = users.find((user) => user.username === username);

  if (!user) {
    return response.status(404).json({ error: "User not found" });
  }

  request.user = user;

  return next();
}

function checksExistsTodo(request, response, next) {
  const { user } = request;
  const { id } = request.params;

  const todo = user.todos.find((todo) => todo.id === id);

  if (!todo) {
    response.status(404).json({ error: "Todo not found" });
  }

  return next();
}

app.post("/users", (request, response) => {
  const { name, username } = request.body;

  const usernameExists = users.find((user) => user.username === username);

  if (usernameExists) {
    return response.status(400).json({ error: "Username unavailable" });
  }

  const user = {
    id: uuidv4(),
    name,
    username,
    todos: [],
  };

  users.push(user);
  response.status(201).json(user);
});

app.get("/todos", checksExistsUserAccount, (request, response) => {
  const { user } = request;

  response.json(user.todos);
});

app.post("/todos", checksExistsUserAccount, (request, response) => {
  const { user } = request;
  const { title, deadline } = request.body;

  const todo = {
    id: uuidv4(),
    title,
    done: false,
    deadline: new Date(deadline), // YEAR-MONTH-DAY
    created_at: new Date(),
  };

  user.todos.push(todo);
  response.status(201).json(todo);
});

app.put(
  "/todos/:id",
  checksExistsUserAccount,
  checksExistsTodo,
  (request, response) => {
    const { user } = request;
    const { id } = request.params;
    const { deadline, title } = request.body;

    const todo = user.todos.find((t) => t.id === id);

    if (deadline) todo.deadline = new Date(deadline);
    if (title) todo.title = title;

    response.json(todo);
  }
);

app.patch(
  "/todos/:id/done",
  checksExistsUserAccount,
  checksExistsTodo,
  (request, response) => {
    const { user } = request;
    const { id } = request.params;

    const todo = user.todos.find((t) => t.id === id);

    todo.done = true;
    response.json(todo);
  }
);

app.delete(
  "/todos/:id",
  checksExistsUserAccount,
  checksExistsTodo,
  (request, response) => {
    const { user } = request;
    const { id } = request.params;

    const todo = user.todos.find((t) => t.id === id);

    user.todos.splice(todo, 1);

    response.status(204).json(user.todos);
  }
);

module.exports = app;
