import bcrypt from "bcryptjs";

export class PasswordService {
  static hashPassword(password: string): string {
    return bcrypt.hashSync(password, 10);
  }

  static verifyPassword(password: string, hash: string): boolean {
    return bcrypt.compareSync(password, hash);
  }
}
