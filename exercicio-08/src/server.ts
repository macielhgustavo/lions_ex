import express, { Request, Response } from 'express';
import { loggerMiddleware } from './middlewares/logger.middleware';
import { IUser } from './models/user';
import { UserService } from './services/user.service';

const app = express();
const userService = new UserService();

app.use(loggerMiddleware);
app.use(express.json());

function getId(value: string | string[]): number | undefined {
  const id = Number(Array.isArray(value) ? value[0] : value);
  return Number.isInteger(id) && id > 0 ? id : undefined;
}

function validNewUser(value: unknown): value is IUser {
  if (typeof value !== 'object' || value === null) return false;
  const user = value as Record<string, unknown>;
  return typeof user.id === 'number' && Number.isInteger(user.id) && user.id > 0 && typeof user.name === 'string' && user.name.trim().length > 0 && typeof user.email === 'string' && user.email.trim().length > 0 && typeof user.active === 'boolean';
}

function validUpdate(value: unknown): value is Partial<Omit<IUser, 'id'>> {
  if (typeof value !== 'object' || value === null) return false;
  const user = value as Record<string, unknown>;
  const keys = Object.keys(user);
  if (keys.length === 0 || keys.some((key) => key !== 'name' && key !== 'email' && key !== 'active')) return false;
  return (user.name === undefined || typeof user.name === 'string') && (user.email === undefined || typeof user.email === 'string') && (user.active === undefined || typeof user.active === 'boolean');
}

app.get('/users', (req: Request, res: Response) => res.json(userService.getAll()));

app.get('/users/:id', (req: Request, res: Response) => {
  const id = getId(req.params.id);
  const user = id ? userService.getById(id) : undefined;
  if (!user) return res.status(404).json({ message: 'Usuário não encontrado' });
  res.json(user);
});

app.post('/users', (req: Request, res: Response) => {
  if (!validNewUser(req.body)) return res.status(400).json({ message: 'Dados inválidos' });
  if (userService.getById(req.body.id)) return res.status(409).json({ message: 'Usuário já existe' });
  const user = userService.create({ id: req.body.id, name: req.body.name.trim(), email: req.body.email.trim(), active: req.body.active });
  res.status(201).json(user);
});

app.put('/users/:id', (req: Request, res: Response) => {
  const id = getId(req.params.id);
  if (!id || !validUpdate(req.body)) return res.status(400).json({ message: 'Dados inválidos' });
  const data: Partial<IUser> = {};
  if (req.body.name !== undefined) data.name = req.body.name.trim();
  if (req.body.email !== undefined) data.email = req.body.email.trim();
  if (req.body.active !== undefined) data.active = req.body.active;
  const user = userService.update(id, data);
  if (!user) return res.status(404).json({ message: 'Usuário não encontrado' });
  res.json(user);
});

app.delete('/users/:id', (req: Request, res: Response) => {
  const id = getId(req.params.id);
  const user = id ? userService.delete(id) : undefined;
  if (!user) return res.status(404).json({ message: 'Usuário não encontrado' });
  res.status(204).send();
});

app.listen(3008, () => console.log('Servidor do exercício 08 na porta 3008'));
