import { Injectable, UnauthorizedException } from '@nestjs/common';

export interface AdminUser {
  id: number;
  email: string;
  name: string;
}

@Injectable()
export class AuthService {
  // 💡 admin მონაცემები env-იდან
  private readonly admin = {
    id: 1,
    email: process.env.ADMIN_EMAIL,
    password: process.env.ADMIN_PASSWORD,
    name: 'ლაშა',
  };

  private validateAdmin(email: string, password: string): AdminUser | null {
    // დაცვა იმ შემთხვევისთვის, თუ env არ არის დაყენებული
    if (!this.admin.email || !this.admin.password) {
      console.error('ADMIN_EMAIL ან ADMIN_PASSWORD არ არის დაყენებული env-ში');
      return null;
    }

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
