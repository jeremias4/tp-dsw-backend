import express, { NextFunction, Request, Response } from 'express';
import { User } from './user.entity.js';

const app = express();
app.use(express.json());

// user -> /api/users

//post -> /api/users
//delete-put-patch /api/users/:id

const users = [new User('0', 'Jeremias', 'Creador', [], [])];

function sanitizeUserInput(req: Request, res: Response, next: NextFunction) {
  req.body.santizedInput = {
    id: req.body.id,
    name: req.body.name,
    userClass: req.body.userClass,
    eventsSell: req.body.eventsSell,
    eventsBuy: req.body.eventsBuy,
  };

  Object.keys(req.body.sanitizedInput).forEach((key) => {
    if (req.body.sanitizedInput[key] === undefined) {
      console.log('error');
      delete req.body.sanitizedInput[key];
    }
  });

  next();
}

app.get('/api/users', (req, res) => {
  res.json({ data: users });
});

app.get('/api/users/:id', (req, res) => {
  const user = users.find((user) => user.id === req.params.id);
  if (!user) {
    return res.status(404).send({ message: 'Character not found' });
  }
  res.json({ data: user });
});

app.post('/api/new', sanitizeUserInput, (req, res) => {
  const input = req.body.sanitizedInput;

  const user = new User(
    input.id,
    input.name,
    input.userClass,
    input.eventsBuy,
    input.eventsSell
  );

  users.push(user);
  return res.status(201).send({ message: 'user created', data: user });
});

app.put('/api/users/:id', sanitizeUserInput, (req, res) => {
  const userIdx = users.findIndex((user) => user.id === req.params.id);

  if (userIdx === -1) {
    return res.status(404).send({ message: 'user not found' });
  }

  users[userIdx] = {
    ...users[userIdx],
    ...req.body.sanitizedInput,
  };

  return res.status(200).send({
    message: 'user updated successfully',
    data: users[userIdx],
  });
});

app.patch('/api/users/:id', sanitizeUserInput, (req, res) => {
  const userIdx = users.findIndex((user) => user.id === req.params.id);

  if (userIdx === -1) {
    return res.status(404).send({ message: 'Character not found' });
  }

  Object.assign(users[userIdx], req.body.sanitizedInput);

  return res.status(200).send({
    message: 'User updated successfully',
    data: users[userIdx],
  });
});

app.delete('/api/users/:id', (req, res) => {
  const userIdx = users.findIndex((user) => user.id === req.params.id);

  if (userIdx === -1) {
    res.status(404).send({ message: 'user not found' });
  } else {
    users.splice(userIdx, 1);
    res.status(200).send({ message: 'user deleted successfully' });
  }
});

app.use((_, res) => {
  return res.status(404).send('<h1>Hello world!</h1>');
});

app.listen(3000, () => {
  console.log('Server runnning on http://localhost:3000/');
});
