import express, { NextFunction, Request, Response } from 'express';
import { AppError } from './errors/app-error';
import { errorHandler } from './middlewares/error-handler.middleware';
import { IUser } from './models/user';
import { UserService } from './services/user.service';

const app = express();
const userService = new UserService();

app.use(express.json());

function getId(value: string | string[]): number {
  const id = Number(Array.isArray(value) ? value[0] : value);
  if (!Number.isInteger(id) || id < 1) throw new AppError('ID inválido', 400);
  return id;
}

function newUser(value: unknown): IUser {
  if (typeof value !== 'object' || value === null) throw new AppError('Dados inválidos', 400);
  const user = value as Record<string, unknown>;
  if (typeof user.id !== 'number' || !Number.isInteger(user.id) || user.id < 1) throw new AppError('ID inválido', 400);
  if (typeof user.name !== 'string' || user.name.trim().length === 0) throw new AppError('Nome inválido', 400);
  if (typeof user.email !== 'string' || user.email.trim().length === 0) throw new AppError('E-mail inválido', 400);
  if (typeof user.active !== 'boolean') throw new AppError('Status inválido', 400);
  return { id: user.id, name: user.name.trim(), email: user.email.trim(), active: user.active };
}

function updateUser(value: unknown): Partial<Omit<IUser, 'id'>> {
  if (typeof value !== 'object' || value === null) throw new AppError('Dados inválidos', 400);
  const user = value as Record<string, unknown>;
  const keys = Object.keys(user);
  if (keys.length === 0 || keys.some((key) => key !== 'name' && key !== 'email' && key !== 'active')) throw new AppError('Dados inválidos', 400);
  if (user.name !== undefined && (typeof user.name !== 'string' || user.name.trim().length === 0)) throw new AppError('Nome inválido', 400);
  if (user.email !== undefined && (typeof user.email !== 'string' || user.email.trim().length === 0)) throw new AppError('E-mail inválido', 400);
  if (user.active !== undefined && typeof user.active !== 'boolean') throw new AppError('Status inválido', 400);
  return { ...(user.name === undefined ? {} : { name: user.name.trim() }), ...(user.email === undefined ? {} : { email: user.email.trim() }), ...(user.active === undefined ? {} : { active: user.active }) };
}

app.get('/users', (req: Request, res: Response, next: NextFunction) => {
  try {
    res.json(userService.getAll());
  } catch (error: unknown) {
    next(error);
  }
});

app.get('/users/:id', (req: Request, res: Response, next: NextFunction) => {
  try {
    res.json(userService.getById(getId(req.params.id)));
  } catch (error: unknown) {
    next(error);
  }
});

app.post('/users', (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = newUser(req.body);
    res.status(201).json(userService.create(data));
  } catch (error: unknown) {
    next(error);
  }
});

app.put('/users/:id', (req: Request, res: Response, next: NextFunction) => {
  try {
    res.json(userService.update(getId(req.params.id), updateUser(req.body)));
  } catch (error: unknown) {
    next(error);
  }
});

app.delete('/users/:id', (req: Request, res: Response, next: NextFunction) => {
  try {
    userService.delete(getId(req.params.id));
    res.status(204).send();
  } catch (error: unknown) {
    next(error);
  }
});

app.use(errorHandler);
app.listen(3009, () => console.log('Servidor do exercício 09 na porta 3009'));
