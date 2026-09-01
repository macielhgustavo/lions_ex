import { IUser } from '../models/user';

export class UserService {
  private users: IUser[] = [
    { id: 1, name: 'John Doe', email: 'john@example.com', active: true },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', active: true }
  ];

  getAll(): IUser[] {
    return this.users;
  }

  getById(id: number): IUser | undefined {
    return this.users.find((user) => user.id === id);
  }

  create(user: IUser): IUser {
    this.users.push(user);
    return user;
  }

  update(id: number, user: Partial<IUser>): IUser | undefined {
    const index = this.users.findIndex((item) => item.id === id);
    if (index === -1) return undefined;
    this.users[index] = { ...this.users[index], ...user, id };
    return this.users[index];
  }

  delete(id: number): IUser | undefined {
    const index = this.users.findIndex((user) => user.id === id);
    if (index === -1) return undefined;
    return this.users.splice(index, 1)[0];
  }
}
