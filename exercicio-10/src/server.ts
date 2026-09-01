import express, { NextFunction, Request, Response } from 'express';
import { AppError } from './errors/app-error';
import { errorHandler } from './middlewares/error-handler.middleware';
import { IProduct } from './models/product';
import { ProductService } from './services/product.service';

const app = express();
const productService = new ProductService();

app.use(express.json());

function getId(value: string | string[]): number {
  const id = Number(Array.isArray(value) ? value[0] : value);
  if (!Number.isInteger(id) || id < 1) throw new AppError('ID inválido', 400);
  return id;
}

function productData(value: unknown): Omit<IProduct, 'id'> {
  if (typeof value !== 'object' || value === null) throw new AppError('Dados inválidos', 400);
  const product = value as Record<string, unknown>;
  if (typeof product.name !== 'string' || typeof product.price !== 'number') throw new AppError('Dados inválidos', 400);
  return { name: product.name, price: product.price };
}

app.get('/products', (req: Request, res: Response, next: NextFunction) => {
  try {
    res.json(productService.getAll());
  } catch (error: unknown) {
    next(error);
  }
});

app.get('/products/:id', (req: Request, res: Response, next: NextFunction) => {
  try {
    res.json(productService.getById(getId(req.params.id)));
  } catch (error: unknown) {
    next(error);
  }
});

app.post('/products', (req: Request, res: Response, next: NextFunction) => {
  try {
    res.status(201).json(productService.create(productData(req.body)));
  } catch (error: unknown) {
    next(error);
  }
});

app.put('/products/:id', (req: Request, res: Response, next: NextFunction) => {
  try {
    res.json(productService.update(getId(req.params.id), productData(req.body)));
  } catch (error: unknown) {
    next(error);
  }
});

app.delete('/products/:id', (req: Request, res: Response, next: NextFunction) => {
  try {
    productService.delete(getId(req.params.id));
    res.status(204).send();
  } catch (error: unknown) {
    next(error);
  }
});

app.use(errorHandler);
app.listen(3010, () => console.log('Servidor do exercício 10 na porta 3010'));
