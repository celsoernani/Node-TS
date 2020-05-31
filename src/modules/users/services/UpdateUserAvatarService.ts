import { getRepository } from 'typeorm';
import path from 'path';
import fs from 'fs';
import UploadConfig from '@config/upload';
import User from '@modules/users/typeorm/entities/Users';
import AppError from '@shared/errors/AppError';

interface Request {
  user_id: string;
  avatarFileName: string;
}

class UpdateUserAvatarService {
  public async execute({ user_id, avatarFileName }: Request): Promise<User> {
    const userRepository = getRepository(User);
    const user = await userRepository.findOne(user_id);

    if (!user) {
      throw new AppError('Only autthenticated users can chenage avatar.', 401);
    }
    if (user.avatar) {
      const userAvatarFilePath = path.join(UploadConfig.directory, user.avatar);
      const userAvatarFileExists = await fs.promises.stat(userAvatarFilePath);
      if (userAvatarFileExists) {
        await fs.promises.unlink(userAvatarFilePath);
      }
    }

    user.avatar = avatarFileName;
    await userRepository.save(user);
    delete user.password;
    return user;
  }
}

export default UpdateUserAvatarService;