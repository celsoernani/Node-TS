import { getRepository } from 'typeorm';
import { hash } from 'bcryptjs';
import User from '@modules/users/typeorm/entities/Users';
import AppError from '@shared/errors/AppError';

interface Request {
  name: string;
  email: string;
  password: string;
}
class CreateUserService {
  public async execute({ name, email, password }: Request): Promise<User> {
    const usersRepository = getRepository(User);

    const checkUserExisted = await usersRepository.findOne({
      where: {
        email,
      },
    });

    if (checkUserExisted) {
      throw new AppError('Email address already used');
    }

    const passwordHash = await hash(password, 8);

    const user = usersRepository.create({
      name,
      email,
      password: passwordHash,
    });

    await usersRepository.save(user);
    delete user.password;
    return user;
  }
}

export default CreateUserService;