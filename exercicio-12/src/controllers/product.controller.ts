import { RequestHandler } from 'express';
import { AppError } from '../errors/app-error';
import { IProduct } from '../models/product';
import { ProductService } from '../services/product.service';
import { EmptyBody, EmptyParams, EmptyQuery, IdParams, ProductQuery } from '../types/http.types';

function getId(value: string): number {
  const id = Number(value);
  if (!Number.isInteger(id) || id < 1) throw new AppError('ID inválido', 400);
  return id;
}

function productData(value: unknown): Omit<IProduct, 'id'> {
  if (typeof value !== 'object' || value === null) throw new AppError('Dados inválidos', 400);
  const product = value as Record<string, unknown>;
  if (typeof product.name !== 'string' || typeof product.price !== 'number') throw new AppError('Dados inválidos', 400);
  return { name: product.name, price: product.price };
}

export class ProductController {
  constructor(private readonly productService: ProductService) {}

  list: RequestHandler<EmptyParams, IProduct[], EmptyBody, ProductQuery> = (req, res, next) => {
    try {
      res.json(this.productService.getAll(req.query.name));
    } catch (error: unknown) {
      next(error);
    }
  };

  get: RequestHandler<IdParams, IProduct, EmptyBody, EmptyQuery> = (req, res, next) => {
    try {
      res.json(this.productService.getById(getId(req.params.id)));
    } catch (error: unknown) {
      next(error);
    }
  };

  create: RequestHandler<EmptyParams, IProduct, Omit<IProduct, 'id'>, EmptyQuery> = (req, res, next) => {
    try {
      res.status(201).json(this.productService.create(productData(req.body)));
    } catch (error: unknown) {
      next(error);
    }
  };

  update: RequestHandler<IdParams, IProduct, Omit<IProduct, 'id'>, EmptyQuery> = (req, res, next) => {
    try {
      res.json(this.productService.update(getId(req.params.id), productData(req.body)));
    } catch (error: unknown) {
      next(error);
    }
  };

  delete: RequestHandler<IdParams, void, EmptyBody, EmptyQuery> = (req, res, next) => {
    try {
      this.productService.delete(getId(req.params.id));
      res.status(204).send();
    } catch (error: unknown) {
      next(error);
    }
  };
}
