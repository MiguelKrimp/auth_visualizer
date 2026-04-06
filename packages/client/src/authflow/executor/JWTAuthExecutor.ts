import type { JSX } from 'react';

import { DocumentEndpoint } from '../../api/rest/DocumentEndpoint';
import { JWTEndpoint } from '../../api/rest/JWTEndpoint';
import { SpySession } from '../../api/spySession/SpySession';
import { encodeBasicCredentials } from '../../util/EncodingUtil';
import { FlowRenderer } from '../renderer/FlowRenderer';
import { AbstractFlowExecutor } from './AbstractFlowExecutor';

export class JWTAuthExecutor extends AbstractFlowExecutor {
  constructor(renderCallback: (elements: JSX.Element[]) => void) {
    super(renderCallback, new FlowRenderer());
  }

  async execute(): Promise<void> {
    this.renderCallback(this.renderer.renderInitial());

    // TODO show popup to ask for username and password
    const spy = await SpySession.get();
    const username = 'demo_user';
    const password = 'hdHUIß249!7zR98_ab';

    const credentials = encodeBasicCredentials(username, password);

    const authHeader = `Basic ${credentials}`;

    spy.onPause((stepLabel, info) => {
      this.renderCallback(this.renderer.renderStepInfoServer(stepLabel, info));
    });

    const jwtEndPoint = new JWTEndpoint();

    this.renderCallback(this.renderer.renderLineFromClient(`POST ${jwtEndPoint.getPath()}`));
    const jwt = await jwtEndPoint.post(authHeader, spy.sessionId);
    this.renderCallback(this.renderer.renderLineFromServer('Received JWT'));

    await this.pause();
    const docEndPoint = new DocumentEndpoint();
    this.renderCallback(this.renderer.renderLineFromClient(`GET ${docEndPoint.getPath()}`));
    await docEndPoint.get(`Bearer ${jwt}`, spy.sessionId);
    this.renderCallback(this.renderer.renderLineFromServer('Received Document'));

    this.renderCallback(this.renderer.renderSeparator('50px'));

    // TODO render popup with image+dataUrl
  }
}
