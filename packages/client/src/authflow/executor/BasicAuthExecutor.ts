import type { JSX } from 'react';

import { DocumentEndpoint } from '../../api/rest/DocumentEndpoint';
import { SpySession } from '../../api/spySession/SpySession';
import { FlowRenderer } from '../renderer/FlowRenderer';
import { AbstractFlowExecutor } from './AbstractFlowExecutor';

export class BasicAuthExecutor extends AbstractFlowExecutor {
  constructor(renderCallback: (elements: JSX.Element[]) => void) {
    super(renderCallback, new FlowRenderer());
  }

  async execute(): Promise<void> {
    this.renderCallback(this.renderer.renderInitial());

    // TODO show popup to ask for username and password

    const spy = await SpySession.get();
    const username = 'demo_user';
    const password = 'hdHUIß249!7zR98_ab';

    const credentials = btoa(`${username}:${password}`);
    const authHeader = `Basic ${credentials}`;

    spy.onPause((stepLabel, info) => {
      // TODO render info about step
    });

    // TODO render line to server
    const dataUrl = await new DocumentEndpoint().get(authHeader, spy.sessionId);
    // TODO render line to client
    // TODO render popup with image+dataUrl
  }
}
