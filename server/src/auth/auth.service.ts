import { Injectable, UnauthorizedException } from '@nestjs/common';

export interface AdminUser {
  id: number;
  email: string;
  name: string;
}

@Injectable()
export class AuthService {
  // 💡 მარტივი hard-coded admin.
  // როცა რეალური DB გექნება, ადვილად შეცვლი.
  private readonly admin = {
    id: 1,
    email: 'admin@lasha.gavtadze',
    password: 'lasha123', // plain ტექსტი ამ ეტაპზე
    name: 'ლაშა',
  };

  private validateAdmin(email: string, password: string): AdminUser | null {
    if (email === this.admin.email && password === this.admin.password) {
      const { id, email: adminEmail, name } = this.admin;
      return { id, email: adminEmail, name };
    }
    return null;
  }

  login(email: string, password: string) {
    const admin = this.validateAdmin(email, password);
    if (!admin) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // ჯერჯერობით უბრალო accessToken – მერე JWT-ზე გადავალთ
    const accessToken = `admin-${admin.id}-${Date.now()}`;

    return {
      accessToken,
      admin,
    };
  }
}
