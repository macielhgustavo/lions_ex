import express, { Request, Response } from 'express';
import { loggerMiddleware } from './middlewares/logger.middleware';
import { IUser } from './models/user';

const app = express();
const users: IUser[] = [
  { id: 1, name: 'John Doe', email: 'john@example.com', active: true },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', active: true }
];

app.use(loggerMiddleware);
app.use(express.json());

function getId(value: string | string[]): number | undefined {
  const id = Number(Array.isArray(value) ? value[0] : value);
  return Number.isInteger(id) && id > 0 ? id : undefined;
}

function validUser(value: unknown): value is IUser {
  if (typeof value !== 'object' || value === null) return false;
  const user = value as Record<string, unknown>;
  return typeof user.id === 'number' && Number.isInteger(user.id) && user.id > 0 && typeof user.name === 'string' && user.name.trim().length > 0 && typeof user.email === 'string' && user.email.trim().length > 0 && typeof user.active === 'boolean';
}

app.get('/users', (req: Request, res: Response) => {
  res.json(users);
});

app.get('/users/:id', (req: Request, res: Response) => {
  const id = getId(req.params.id);
  const user = users.find((item) => item.id === id);
  if (!user) return res.status(404).json({ message: 'Usuário não encontrado' });
  res.json(user);
});

app.post('/users', (req: Request, res: Response) => {
  if (!validUser(req.body)) return res.status(400).json({ message: 'Dados inválidos' });
  if (users.some((item) => item.id === req.body.id)) return res.status(409).json({ message: 'Usuário já existe' });
  const user: IUser = { id: req.body.id, name: req.body.name.trim(), email: req.body.email.trim(), active: req.body.active };
  users.push(user);
  res.status(201).json(user);
});

app.put('/users/:id', (req: Request, res: Response) => {
  const id = getId(req.params.id);
  const index = users.findIndex((item) => item.id === id);
  if (index === -1) return res.status(404).json({ message: 'Usuário não encontrado' });
  if (!validUser(req.body) || req.body.id !== id) return res.status(400).json({ message: 'Dados inválidos' });
  users[index] = { id: req.body.id, name: req.body.name.trim(), email: req.body.email.trim(), active: req.body.active };
  res.json(users[index]);
});

app.delete('/users/:id', (req: Request, res: Response) => {
  const id = getId(req.params.id);
  const index = users.findIndex((item) => item.id === id);
  if (index === -1) return res.status(404).json({ message: 'Usuário não encontrado' });
  users.splice(index, 1);
  res.status(204).send();
});

app.listen(3007, () => console.log('Servidor do exercício 07 na porta 3007'));
