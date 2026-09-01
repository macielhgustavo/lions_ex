import { RequestHandler } from 'express';
import { AppError } from '../errors/app-error';
import { IUser } from '../models/user';
import { UserService } from '../services/user.service';
import { EmptyBody, EmptyParams, EmptyQuery, IdParams } from '../types/http.types';

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

export class UserController {
  constructor(private readonly userService: UserService) {}

  list: RequestHandler<EmptyParams, IUser[], EmptyBody, EmptyQuery> = async (req, res, next) => {
    try {
      res.json(await this.userService.getAll());
    } catch (error: unknown) {
      next(error);
    }
  };

  get: RequestHandler<IdParams, IUser, EmptyBody, EmptyQuery> = async (req, res, next) => {
    try {
      res.json(await this.userService.getById(getId(req.params.id)));
    } catch (error: unknown) {
      next(error);
    }
  };

  create: RequestHandler<EmptyParams, IUser, IUser, EmptyQuery> = async (req, res, next) => {
    try {
      res.status(201).json(await this.userService.create(userData(req.body)));
    } catch (error: unknown) {
      next(error);
    }
  };

  update: RequestHandler<IdParams, IUser, Partial<Omit<IUser, 'id'>>, EmptyQuery> = async (req, res, next) => {
    try {
      res.json(await this.userService.update(getId(req.params.id), userUpdate(req.body)));
    } catch (error: unknown) {
      next(error);
    }
  };

  delete: RequestHandler<IdParams, void, EmptyBody, EmptyQuery> = async (req, res, next) => {
    try {
      await this.userService.delete(getId(req.params.id));
      res.status(204).send();
    } catch (error: unknown) {
      next(error);
    }
  };
}
