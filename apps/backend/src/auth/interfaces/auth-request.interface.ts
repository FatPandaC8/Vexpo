import { JwtUser } from '@vexpo/schema';
import { Request } from 'express';

export interface AuthRequest extends Request {
  user: JwtUser;
}
