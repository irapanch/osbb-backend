import 'express-session';

declare module 'express-session' {
  interface SessionData {
    userId?: string; // щоб отримувати із сессії наш userId і потім по ньому виконувати повний пошук користувача
  }
}
declare global {
  namespace Express {
    interface Request {
      session: Session & Partial<SessionData>;
    }
  }
}
