import { ValidAuthSteps } from '@auth-visualizer/common/authflow/steps/AuthSteps';
import { SPY_SESSION_HEADER } from '@auth-visualizer/common/SpySessionConstants';
import { Request, Response } from 'express';
import { Socket } from 'socket.io';

import { ISpySession, NOOPSpySession, SpySession } from './SpySession';

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

  createSession(socket: Socket): SpySession<ValidAuthSteps> {
    const session = new SpySession(socket);
    this.sessions.set(session.id, session);

    session.onDisconnect(() => {
      this.sessions.delete(session.id);
    });

    return session;
  }

  getSession(id?: string): ISpySession {
    const session = id ? this.sessions.get(id) : undefined;
    if (!session) {
      return new NOOPSpySession();
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
