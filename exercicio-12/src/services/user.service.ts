import { AppError } from '../errors/app-error';
import { IUser } from '../models/user';
import { IUserRepository } from '../repositories/user.repository';

export class UserService {
  constructor(private readonly userRepository: IUserRepository) {}

  async getAll(): Promise<IUser[]> {
    return this.userRepository.findAll();
  }

  async getById(id: number): Promise<IUser> {
    const user = await this.userRepository.findById(id);
    if (!user) throw new AppError('Usuário não encontrado', 404);
    return user;
  }

  async create(data: IUser): Promise<IUser> {
    const user = await this.userRepository.findById(data.id);
    if (user) throw new AppError('Usuário já existe', 409);
    return this.userRepository.create(data);
  }

  async update(id: number, data: Partial<Omit<IUser, 'id'>>): Promise<IUser> {
    const user = await this.userRepository.update(id, data);
    if (!user) throw new AppError('Usuário não encontrado', 404);
    return user;
  }

  async delete(id: number): Promise<void> {
    const deleted = await this.userRepository.delete(id);
    if (!deleted) throw new AppError('Usuário não encontrado', 404);
  }
}
