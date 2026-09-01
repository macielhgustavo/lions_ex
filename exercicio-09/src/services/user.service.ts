import { AppError } from '../errors/app-error';
import { IUser } from '../models/user';

export class UserService {
  private users: IUser[] = [
    { id: 1, name: 'John Doe', email: 'john@example.com', active: true },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', active: true }
  ];

  getAll(): IUser[] {
    return this.users;
  }

  getById(id: number): IUser {
    const user = this.users.find((item) => item.id === id);
    if (!user) throw new AppError('Usuário não encontrado', 404);
    return user;
  }

  create(user: IUser): IUser {
    if (this.users.some((item) => item.id === user.id)) throw new AppError('Usuário já existe', 409);
    this.users.push(user);
    return user;
  }

  update(id: number, data: Partial<IUser>): IUser {
    const index = this.users.findIndex((item) => item.id === id);
    if (index === -1) throw new AppError('Usuário não encontrado', 404);
    this.users[index] = { ...this.users[index], ...data, id };
    return this.users[index];
  }

  delete(id: number): void {
    const index = this.users.findIndex((item) => item.id === id);
    if (index === -1) throw new AppError('Usuário não encontrado', 404);
    this.users.splice(index, 1);
  }
}
