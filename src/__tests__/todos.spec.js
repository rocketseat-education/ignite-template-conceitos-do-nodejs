const request = require('supertest');
const { validate } = require('uuid');

const app = require('../');

describe('Todos', () => {
  it("should be able to list all user's todo", async () => {
    const userResponse = await request(app)
      .post('/users')
      .send({
        name: 'John Doe',
        username: 'user1'
      });

    const todoDate = new Date();

    const todoResponse = await request(app)
      .post('/todos')
      .send({
        title: 'test todo',
        deadline: todoDate
      })
      .set('username', userResponse.body.username);

    const response = await request(app)
      .get('/todos')
      .set('username', userResponse.body.username);

    expect(response.body).toEqual(
      expect.arrayContaining([
        todoResponse.body
      ]),
    )
  });

  it('should be able to create a new todo', async () => {
    const userResponse = await request(app)
      .post('/users')
      .send({
        name: 'John Doe',
        username: 'user2'
      });

    const todoDate = new Date();

    const response = await request(app)
      .post('/todos')
      .send({
        title: 'test todo',
        deadline: todoDate
      })
      .set('username', userResponse.body.username)
      .expect(201);

    expect(response.body).toMatchObject({
      title: 'test todo',
      deadline: todoDate.toISOString(),
      done: false
    });
    expect(validate(response.body.id)).toBe(true);
    expect(response.body.created_at).toBeTruthy();
  });

  it('should be able to update a todo', async () => {
    const userResponse = await request(app)
      .post('/users')
      .send({
        name: 'John Doe',
        username: 'user7'
      });

    const todoDate = new Date();

    const todoResponse = await request(app)
      .post('/todos')
      .send({
        title: 'test todo',
        deadline: todoDate
      })
      .set('username', userResponse.body.username);

    const response = await request(app)
      .put(`/todos/${todoResponse.body.id}`)
      .send({
        title: 'update title',
        deadline: todoDate
      })
      .set('username', userResponse.body.username);

    expect(response.body).toMatchObject({
      title: 'update title',
      deadline: todoDate.toISOString(),
      done: false
    });
  });

  it('should not be able to update a non existing todo', async () => {
    const userResponse = await request(app)
      .post('/users')
      .send({
        name: 'John Doe',
        username: 'user8'
      });

    const todoDate = new Date();

    const response = await request(app)
      .put('/todos/invalid-todo-id')
      .send({
        title: 'update title',
        deadline: todoDate
      })
      .set('username', userResponse.body.username)
      .expect(404);

    expect(response.body.error).toBeTruthy();
  });

  it('should be able to mark a todo as done', async () => {
    const userResponse = await request(app)
      .post('/users')
      .send({
        name: 'John Doe',
        username: 'user3'
      });

    const todoDate = new Date();

    const todoResponse = await request(app)
      .post('/todos')
      .send({
        title: 'test todo',
        deadline: todoDate
      })
      .set('username', userResponse.body.username);

    const response = await request(app)
      .patch(`/todos/${todoResponse.body.id}/done`)
      .set('username', userResponse.body.username);

    expect(response.body).toMatchObject({
      ...todoResponse.body,
      done: true
    });
  });

  it('should not be able to mark a non existing todo as done', async () => {
    const userResponse = await request(app)
      .post('/users')
      .send({
        name: 'John Doe',
        username: 'user4'
      });

    const response = await request(app)
      .patch('/todos/invalid-todo-id/done')
      .set('username', userResponse.body.username)
      .expect(404);

    expect(response.body.error).toBeTruthy();
  });

  it('should be able to delete a todo', async () => {
    const userResponse = await request(app)
      .post('/users')
      .send({
        name: 'John Doe',
        username: 'user5'
      });

    const todoDate = new Date();

    const todo1Response = await request(app)
      .post('/todos')
      .send({
        title: 'test todo',
        deadline: todoDate
      })
      .set('username', userResponse.body.username);

    await request(app)
      .delete(`/todos/${todo1Response.body.id}`)
      .set('username', userResponse.body.username)
      .expect(204);

    const listResponse = await request(app)
      .get('/todos')
      .set('username', userResponse.body.username);

    expect(listResponse.body).toEqual([]);
  });

  it('should not be able to delete a non existing todo', async () => {
    const userResponse = await request(app)
      .post('/users')
      .send({
        name: 'John Doe',
        username: 'user6'
      });

    const response = await request(app)
      .delete('/todos/invalid-todo-id')
      .set('username', userResponse.body.username)
      .expect(404);

    expect(response.body.error).toBeTruthy();
  });
});