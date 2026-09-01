import { AppError } from '../errors/app-error';
import { IProduct } from '../models/product';

export class ProductService {
  private products: IProduct[] = [];

  getAll(): IProduct[] {
    return this.products;
  }

  getById(id: number): IProduct {
    const product = this.products.find((item) => item.id === id);
    if (!product) throw new AppError('Produto não encontrado', 404);
    return product;
  }

  create(data: Omit<IProduct, 'id'>): IProduct {
    this.validate(data);
    const product = { id: this.products.length + 1, name: data.name.trim(), price: data.price };
    this.products.push(product);
    return product;
  }

  update(id: number, data: Omit<IProduct, 'id'>): IProduct {
    const index = this.products.findIndex((item) => item.id === id);
    if (index === -1) throw new AppError('Produto não encontrado', 404);
    this.validate(data);
    this.products[index] = { id, name: data.name.trim(), price: data.price };
    return this.products[index];
  }

  delete(id: number): void {
    const index = this.products.findIndex((item) => item.id === id);
    if (index === -1) throw new AppError('Produto não encontrado', 404);
    this.products.splice(index, 1);
  }

  private validate(data: Omit<IProduct, 'id'>): void {
    if (typeof data.name !== 'string' || data.name.trim().length < 3) throw new AppError('Nome deve ter pelo menos 3 caracteres', 400);
    if (typeof data.price !== 'number' || Number.isNaN(data.price) || data.price < 0) throw new AppError('Preço inválido', 400);
  }
}
