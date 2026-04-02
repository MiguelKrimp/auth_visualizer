import { Request, Response } from 'express';

import { ValidAuthSteps } from '../../../common/authflow/steps/AuthSteps';
import { SPY_SESSION_HEADER } from '../../../common/SpySessionConstants';
import { ISpySession, SpySession } from './SpySession';

export class SpySessionBroker {
  private static instance: SpySessionBroker;

  static getInstance(): SpySessionBroker {
    if (!SpySessionBroker.instance) {
      SpySessionBroker.instance = new SpySessionBroker();
    }
    return SpySessionBroker.instance;
  }

  private sessions: Map<string, ISpySession> = new Map();
  private constructor() {}

  createSession(): ISpySession {
    const session = new SpySession();
    this.sessions.set(session.id, session);
    return session;
  }

  getSession(id?: string): ISpySession {
    const session = id ? this.sessions.get(id) : undefined;
    if (!session) {
      // return new NOOPSpySession();
      return new SpySession();
    }

    return session;
  }

  injectSpySession<T extends HandlerWithSpySession>(
    handler: T,
  ): (req: Request, res: Response) => ReturnType<T> {
    return (req: Request, res: Response) => {
      const sessionId = req.header(SPY_SESSION_HEADER);
      const session = this.getSession(sessionId);
      return handler(req, res, session);
    };
  }
}

export type Handler<T extends HandlerWithSpySession<ValidAuthSteps>> = (
  req: Request,
  res: Response,
) => ReturnType<T>;

export type HandlerWithSpySession<T extends ValidAuthSteps = ValidAuthSteps> = (
  req: Request,
  res: Response,
  spy: ISpySession<T>,
) => any;
