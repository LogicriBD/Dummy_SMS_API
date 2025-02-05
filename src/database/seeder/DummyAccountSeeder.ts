import { Seeder } from '../../types/Seeder';
import { log } from '../../utils/Helper';
import { UserRepository } from '../repository/UserRepository';
import bcrypt from 'bcrypt';

export class DummyAccountSeeder implements Seeder {
  async seed() {
    const user = await UserRepository.findOneByEmail(process.env.SUDO_EMAIL!);
    if (user) {
      log('warn', '🟠 System admin account already exists');
      return;
    }
    const salt = await bcrypt.genSalt(Number(process.env.SALT_SIZE!));
    const password = await bcrypt.hash(process.env.SUDO_PASSWORD!, salt);
    await UserRepository.create({
      email: process.env.SUDO_EMAIL!,
      password,
      username: 'SUDO',
      verified: true,
    });
    log('info', '✅ System admin account seeded');
  }

  async undo() {
    //Cannot Undo System Admin Account Seeder
  }
}
