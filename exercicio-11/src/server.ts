import express, { NextFunction, RequestHandler } from 'express';
import { AppError } from './errors/app-error';
import { errorHandler } from './middlewares/error-handler.middleware';
import { IProduct } from './models/product';
import { IUser } from './models/user';
import { ProductService } from './services/product.service';
import { UserService } from './services/user.service';
import { EmptyBody, EmptyParams, EmptyQuery, IdParams, ProductQuery } from './types/http.types';

const app = express();
const userService = new UserService();
const productService = new ProductService();

app.use(express.json());

function getId(value: string): number {
  const id = Number(value);
  if (!Number.isInteger(id) || id < 1) throw new AppError('ID inválido', 400);
  return id;
}

function userData(value: unknown): IUser {
  if (typeof value !== 'object' || value === null) throw new AppError('Dados inválidos', 400);
  const user = value as Record<string, unknown>;
  if (typeof user.id !== 'number' || !Number.isInteger(user.id) || user.id < 1) throw new AppError('ID inválido', 400);
  if (typeof user.name !== 'string' || user.name.trim().length === 0) throw new AppError('Nome inválido', 400);
  if (typeof user.email !== 'string' || user.email.trim().length === 0) throw new AppError('E-mail inválido', 400);
  if (typeof user.active !== 'boolean') throw new AppError('Status inválido', 400);
  return { id: user.id, name: user.name.trim(), email: user.email.trim(), active: user.active };
}

function userUpdate(value: unknown): Partial<Omit<IUser, 'id'>> {
  if (typeof value !== 'object' || value === null) throw new AppError('Dados inválidos', 400);
  const user = value as Record<string, unknown>;
  const keys = Object.keys(user);
  if (keys.length === 0 || keys.some((key) => key !== 'name' && key !== 'email' && key !== 'active')) throw new AppError('Dados inválidos', 400);
  if (user.name !== undefined && (typeof user.name !== 'string' || user.name.trim().length === 0)) throw new AppError('Nome inválido', 400);
  if (user.email !== undefined && (typeof user.email !== 'string' || user.email.trim().length === 0)) throw new AppError('E-mail inválido', 400);
  if (user.active !== undefined && typeof user.active !== 'boolean') throw new AppError('Status inválido', 400);
  return { ...(user.name === undefined ? {} : { name: user.name.trim() }), ...(user.email === undefined ? {} : { email: user.email.trim() }), ...(user.active === undefined ? {} : { active: user.active }) };
}

function productData(value: unknown): Omit<IProduct, 'id'> {
  if (typeof value !== 'object' || value === null) throw new AppError('Dados inválidos', 400);
  const product = value as Record<string, unknown>;
  if (typeof product.name !== 'string' || typeof product.price !== 'number') throw new AppError('Dados inválidos', 400);
  return { name: product.name, price: product.price };
}

const listUsers: RequestHandler<EmptyParams, IUser[], EmptyBody, EmptyQuery> = (req, res, next) => {
  try {
    res.json(userService.getAll());
  } catch (error: unknown) {
    next(error);
  }
};

const getUser: RequestHandler<IdParams, IUser, EmptyBody, EmptyQuery> = (req, res, next) => {
  try {
    res.json(userService.getById(getId(req.params.id)));
  } catch (error: unknown) {
    next(error);
  }
};

const createUser: RequestHandler<EmptyParams, IUser, IUser, EmptyQuery> = (req, res, next) => {
  try {
    res.status(201).json(userService.create(userData(req.body)));
  } catch (error: unknown) {
    next(error);
  }
};

const updateUser: RequestHandler<IdParams, IUser, Partial<Omit<IUser, 'id'>>, EmptyQuery> = (req, res, next) => {
  try {
    res.json(userService.update(getId(req.params.id), userUpdate(req.body)));
  } catch (error: unknown) {
    next(error);
  }
};

const deleteUser: RequestHandler<IdParams, void, EmptyBody, EmptyQuery> = (req, res, next) => {
  try {
    userService.delete(getId(req.params.id));
    res.status(204).send();
  } catch (error: unknown) {
    next(error);
  }
};

const listProducts: RequestHandler<EmptyParams, IProduct[], EmptyBody, ProductQuery> = (req, res, next) => {
  try {
    res.json(productService.getAll(req.query.name));
  } catch (error: unknown) {
    next(error);
  }
};

const getProduct: RequestHandler<IdParams, IProduct, EmptyBody, EmptyQuery> = (req, res, next) => {
  try {
    res.json(productService.getById(getId(req.params.id)));
  } catch (error: unknown) {
    next(error);
  }
};

const createProduct: RequestHandler<EmptyParams, IProduct, Omit<IProduct, 'id'>, EmptyQuery> = (req, res, next) => {
  try {
    res.status(201).json(productService.create(productData(req.body)));
  } catch (error: unknown) {
    next(error);
  }
};

const updateProduct: RequestHandler<IdParams, IProduct, Omit<IProduct, 'id'>, EmptyQuery> = (req, res, next) => {
  try {
    res.json(productService.update(getId(req.params.id), productData(req.body)));
  } catch (error: unknown) {
    next(error);
  }
};

const deleteProduct: RequestHandler<IdParams, void, EmptyBody, EmptyQuery> = (req, res, next) => {
  try {
    productService.delete(getId(req.params.id));
    res.status(204).send();
  } catch (error: unknown) {
    next(error);
  }
};

app.get('/users', listUsers);
app.get('/users/:id', getUser);
app.post('/users', createUser);
app.put('/users/:id', updateUser);
app.delete('/users/:id', deleteUser);
app.get('/products', listProducts);
app.get('/products/:id', getProduct);
app.post('/products', createProduct);
app.put('/products/:id', updateProduct);
app.delete('/products/:id', deleteProduct);
app.use(errorHandler);
app.listen(3011, () => console.log('Servidor do exercício 11 na porta 3011'));
